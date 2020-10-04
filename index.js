const core = require('@actions/core');

const parseTitle = require('./parse-title');
const {Octokit} = require("@octokit/action");
const octokit = new Octokit();
const event = require(process.env.GITHUB_EVENT_PATH);

function parseList(string) {
  return string.split(/[,\n]+/).map(line => line.trim()).filter(Boolean);
}

async function run() {
  if (process.env.GITHUB_EVENT_NAME === 'issue') {
    throw new Error('Only `issue` events are supported. Received: ' + process.env.GITHUB_EVENT_NAME)
  }

  if (['opened', 'edited'].includes(event.event)) {
    throw new Error('Only `issue.opened` and `issue.edited` events are supported. Received: issue.' + event.event)
  }

  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  const issue_number = event.issue.number;

  const keywords = parseList(core.getInput('keywords', {required: true}));
  const labels = parseList(core.getInput('labels'));
  core.debug(`Received keywords: ${keywords.join(', ')}`);
  core.debug(`Received labels: ${labels.join(', ')}`);

  const {title, labels} = parseTitle(event.issue.title, {keywords, labels});

  if (event.issue.title === title) {
    core.info('No title changes needed')
    return;
  }

  core.info(`Changing title from "${event.issue.title}" to ${title}`);
  core.info(`Adding labels: ${labels.join(', ')}`);

  await Promise.all([
    octokit.issues.addLabels({owner, repo, labels, issue_number}),
    octokit.issues.update({owner, repo, issue_number, title})
  ]);
}

run().catch(() => {
  core.setFailed(error.message);
});
