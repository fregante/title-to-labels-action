import './sourcemap-register.cjs';import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
/******/ var __webpack_modules__ = ({

/***/ 781:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 860:
/***/ ((module) => {

module.exports = eval("require")("@octokit/action");


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

;// CONCATENATED MODULE: external "node:fs"
const external_node_fs_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:fs");
;// CONCATENATED MODULE: external "node:process"
const external_node_process_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:process");
// EXTERNAL MODULE: ../../../.npm/_npx/7a71fb44c9115061/node_modules/@vercel/ncc/dist/ncc/@@notfound.js?@actions/core
var core = __nccwpck_require__(781);
// EXTERNAL MODULE: ../../../.npm/_npx/7a71fb44c9115061/node_modules/@vercel/ncc/dist/ncc/@@notfound.js?@octokit/action
var action = __nccwpck_require__(860);
;// CONCATENATED MODULE: ./defaults.json
const defaults_namespaceObject = /*#__PURE__*/JSON.parse('[{"keywords":["enhancement","feature request","new feature","feat","fr","idea","suggestion"],"labels":["enhancement"]},{"keywords":["bug","bug report","error","fix","fixes"],"labels":["bug"]}]');
;// CONCATENATED MODULE: ./parse-title.js


function titleCase(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function parseTitle(title, {keywords, labels}) {
	const separator = /[):\]]+|\s-+/.exec(title);
	if (!separator) {
		return {title, labels: []};
	}

	const intro = title
		.slice(0, separator.index)
		.replaceAll(/[^\s\w]/g, '')
		.trim()
		.toLowerCase();
	if (intro && keywords.some(keyword => keyword.toLowerCase() === intro)) {
		const cleanTitle = title.slice(separator.index + separator[0].length).trim();
		return {
			labels: labels ?? [],
			title: titleCase(cleanTitle),
		};
	}

	return {title, labels: []};
}

function parseTitleWithDefaults(title) {
	for (const {keywords, labels} of defaults_namespaceObject) {
		console.log(keywords, labels);
		const updates = parseTitle(title, {keywords, labels});
		if (title !== updates.title) {
			return updates;
		}
	}

	return {title, labels: []};
}


;// CONCATENATED MODULE: ./index.js






const index_event = JSON.parse(external_node_fs_namespaceObject.readFileSync(external_node_process_namespaceObject.env.GITHUB_EVENT_PATH));

function parseList(string) {
	return string
		.split(/[\n,]+/)
		.map(line => line.trim())
		.filter(Boolean);
}

function getInputs() {
	const keywords = parseList((0,core.getInput)('keywords'));
	const labels = parseList((0,core.getInput)('labels'));
	const updateTitle = (0,core.getInput)('update-title').toLowerCase() !== 'false';
	(0,core.debug)(`Received keywords: ${keywords.join(', ')}`);
	(0,core.debug)(`Received labels: ${labels.join(', ')}`);
	(0,core.debug)(`Update title: ${updateTitle}`);
	return {keywords, labels, updateTitle};
}

async function run() {
	if (!['issues', 'pull_request', 'pull_request_target'].includes(external_node_process_namespaceObject.env.GITHUB_EVENT_NAME)) {
		throw new Error('Only `issues` and `pull_request` events are supported. Received: ' + external_node_process_namespaceObject.env.GITHUB_EVENT_NAME);
	}

	if (!['opened', 'edited'].includes(index_event.action)) {
		throw new Error(`Only types \`opened\` and \`edited\` events are supported. Received: ${external_node_process_namespaceObject.env.GITHUB_EVENT_NAME}.${index_event.action}`);
	}

	const conversation = index_event.issue || index_event.pull_request;
	const {keywords, labels: inputLabels, updateTitle} = getInputs();
	let update = {};
	if ((0,core.getInput)('keywords')) {
		update = parseTitle(conversation.title, {keywords, labels: inputLabels});
	} else if ((0,core.getInput)('labels')) {
		throw new Error('Labels can’t be set without keywords. Set neither, set only keywords, or set both.');
	} else {
		(0,core.info)('No keywords defined. The defaults will be used');
		update = parseTitleWithDefaults(conversation.title);
	}

	const {title: parsedTitle, labels} = update;
	const title = updateTitle ? parsedTitle : conversation.title;

	const titleChanged = conversation.title !== title;
	const hasLabels = labels.length > 0;

	if (!titleChanged && !hasLabels) {
		(0,core.info)('No title changes needed');
		return;
	}

	const actions = [];

	if (titleChanged) {
		(0,core.info)(`Changing title from "${conversation.title}" to ${title}`);
	}

	if (hasLabels) {
		(0,core.info)(`Adding labels: ${labels.join(', ')}`);
	}

	const octokit = new action.Octokit();
	const issue_number = conversation.number;
	const [owner, repo] = external_node_process_namespaceObject.env.GITHUB_REPOSITORY.split('/');

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
	(0,core.setFailed)(error.message);
});


//# sourceMappingURL=index.js.map