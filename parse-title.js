const defaults = require('./defaults.json');

function titleCase(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function parseTitle(title, {keywords, labels}) {
	const [, intro] = title.split(/(.+[)-:\]])/, 2);
	console.log(title, intro, title.split(/(.+[)-:\]])/, 2))
	const cleanIntro = intro && intro
		.replace(/[^\s\w]/g, '')
		.toLowerCase()
		.trim();
	if (intro && keywords.some(keyword => keyword.toLowerCase() === cleanIntro)) {
		return {
			labels: labels ? labels : [],
			title: titleCase(title.replace(intro, '').trim())
		};
	}

	return {title, labels: []};
}

function parseTitleWithDefaults(title) {
	for (const {keywords, labels} of defaults) {
		console.log(keywords, labels)
		const updates = parseTitle(title, {keywords, labels});
		if (title !== updates.title) {
			return updates;
		}
	}

	return {title, labels: []};
}

exports.parseTitle = parseTitle;
exports.parseTitleWithDefaults = parseTitleWithDefaults;
