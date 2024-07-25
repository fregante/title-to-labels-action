const core = require('@actions/core');
const {Octokit} = require('@octokit/action');
const {parseTitle, parseTitleWithDefaults} = require('./parse-title');

function parseList(string) {
	return string
		.split(/[\n,]+/)
		.map(line => line.trim())
		.filter(Boolean);
}

function getInputs() {
	const keywords = parseList(core.getInput('keywords'));
	const labels = parseList(core.getInput('labels'));
	core.debug(`Received keywords: ${keywords.join(', ')}`);
	core.debug(`Received labels: ${labels.join(', ')}`);
	return {keywords, labels};
}

async function run() {
	const event = require(process.env.GITHUB_EVENT_PATH);

	if (!['issues', 'pull_request'].includes(process.env.GITHUB_EVENT_NAME)) {
		throw new Error('Only `issues` and `pull_request` events are supported. Received: ' + process.env.GITHUB_EVENT_NAME);
	}

	if (!['opened', 'edited'].includes(event.action)) {
		throw new Error(`Only types \`opened\` and \`edited\` events are supported. Received: ${process.env.GITHUB_EVENT_NAME}.${event.action}`);
	}

	const conversation = event.issue || event.pull_request;
	let update = {};
	if (core.getInput('keywords')) {
		update = parseTitle(conversation.title, getInputs());
	} else if (core.getInput('labels')) {
		throw new Error('Labels can’t be set without keywords. Set neither, set only keywords, or set both.');
	} else {
		core.info('No keywords defined. The defaults will be used');
		update = parseTitleWithDefaults(conversation.title);
	}

	const {title, labels} = update;

	if (conversation.title === title) {
		core.info('No title changes needed');
		return;
	}

	core.info(`Changing title from "${conversation.title}" to ${title}`);
	core.info(`Adding labels: ${labels.join(', ')}`);

	const octokit = new Octokit();
	const issue_number = conversation.number;
	const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
	await Promise.all([
		octokit.issues.addLabels({
			owner, repo, labels, issue_number,
		}),
		octokit.issues.update({
			owner, repo, issue_number, title,
		}),
	]);
}

run().catch(error => {
	core.setFailed(error.message);
});
