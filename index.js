const core = require('@actions/core');
const {Octokit} = require('@octokit/action');
const parseTitle = require('./parse-title');
const event = require(process.env.GITHUB_EVENT_PATH);

const octokit = new Octokit();

function parseList(string) {
	return string
		.split(/[\n,]+/)
		.map(line => line.trim())
		.filter(Boolean);
}

async function run() {
	if (!['issues', 'pull_request'].includes(process.env.GITHUB_EVENT_NAME)) {
		throw new Error('Only `issues` and `pull_request` events are supported. Received: ' + process.env.GITHUB_EVENT_NAME);
	}

	if (!['opened', 'edited'].includes(event.action)) {
		throw new Error(`Only types \`opened\` and \`edited\` events are supported. Received: ${process.env.GITHUB_EVENT_NAME}.${event.action}`);
	}

	const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
	const issue_number = event.issue.number;

	const inputKeywords = parseList(core.getInput('keywords', {required: true}));
	const inputLabels = parseList(core.getInput('labels'));
	core.debug(`Received keywords: ${inputKeywords.join(', ')}`);
	core.debug(`Received labels: ${inputLabels.join(', ')}`);

	const {title, labels} = parseTitle(event.issue.title, {
		keywords: inputKeywords,
		labels: inputLabels
	});

	if (event.issue.title === title) {
		core.info('No title changes needed');
		return;
	}

	core.info(`Changing title from "${event.issue.title}" to ${title}`);
	core.info(`Adding labels: ${labels.join(', ')}`);

	await Promise.all([
		octokit.issues.addLabels({owner, repo, labels, issue_number}),
		octokit.issues.update({owner, repo, issue_number, title})
	]);
}

run().catch(error => {
	core.setFailed(error.message);
});
