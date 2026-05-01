import fs from 'node:fs';
import process from 'node:process';
import {
	getInput, debug, info, setFailed,
} from '@actions/core';
import {Octokit} from '@octokit/action';
import {parseTitle, parseTitleWithDefaults} from './parse-title.js';

const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH));

function parseList(string) {
	return string
		.split(/[\n,]+/)
		.map(line => line.trim())
		.filter(Boolean);
}

function getInputs() {
	const keywords = parseList(getInput('keywords'));
	const labels = parseList(getInput('labels'));
	const updateTitle = getInput('update-title').toLowerCase() !== 'false';
	debug(`Received keywords: ${keywords.join(', ')}`);
	debug(`Received labels: ${labels.join(', ')}`);
	debug(`Update title: ${updateTitle}`);
	return {keywords, labels, updateTitle};
}

async function run() {
	if (!['issues', 'pull_request', 'pull_request_target'].includes(process.env.GITHUB_EVENT_NAME)) {
		throw new Error('Only `issues` and `pull_request` events are supported. Received: ' + process.env.GITHUB_EVENT_NAME);
	}

	if (!['opened', 'edited'].includes(event.action)) {
		throw new Error(`Only types \`opened\` and \`edited\` events are supported. Received: ${process.env.GITHUB_EVENT_NAME}.${event.action}`);
	}

	const conversation = event.issue || event.pull_request;
	const {keywords, labels: inputLabels, updateTitle} = getInputs();
	let update = {};
	if (getInput('keywords')) {
		update = parseTitle(conversation.title, {keywords, labels: inputLabels});
	} else if (getInput('labels')) {
		throw new Error('Labels can’t be set without keywords. Set neither, set only keywords, or set both.');
	} else {
		info('No keywords defined. The defaults will be used');
		update = parseTitleWithDefaults(conversation.title);
	}

	const {title: parsedTitle, labels} = update;
	const title = updateTitle ? parsedTitle : conversation.title;

	const titleChanged = conversation.title !== title;
	const hasLabels = labels.length > 0;

	if (!titleChanged && !hasLabels) {
		info('No title changes needed');
		return;
	}

	const actions = [];

	if (titleChanged) {
		info(`Changing title from "${conversation.title}" to ${title}`);
	}

	if (hasLabels) {
		info(`Adding labels: ${labels.join(', ')}`);
	}

	const octokit = new Octokit();
	const issue_number = conversation.number;
	const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

	if (hasLabels) {
		actions.push(octokit.issues.addLabels({
			owner, repo, labels, issue_number,
		}));
	}

	if (titleChanged) {
		actions.push(octokit.issues.update({
			owner, repo, issue_number, title,
		}));
	}

	await Promise.all(actions);
}

// eslint-disable-next-line unicorn/prefer-top-level-await
run().catch(error => {
	setFailed(error.message);
});
