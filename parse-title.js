const defaults = require('./defaults.json');

function titleCase(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function parseTitle(title, {keywords, labels}) {
	const separator = /[)\-:\]]+/.exec(title);
	if (!separator) {
		return {title, labels: []};
	}

	const intro = title
		.slice(0, separator.index)
		.replace(/[^\s\w]/g, '')
		.trim()
		.toLowerCase();
	if (intro && keywords.some(keyword => keyword.toLowerCase() === intro)) {
		const cleanTitle = title.slice(separator.index + separator[0].length).trim();
		return {
			labels: labels ? labels : [],
			title: titleCase(cleanTitle)
		};
	}

	return {title, labels: []};
}

function parseTitleWithDefaults(title) {
	for (const {keywords, labels} of defaults) {
		console.log(keywords, labels);
		const updates = parseTitle(title, {keywords, labels});
		if (title !== updates.title) {
			return updates;
		}
	}

	return {title, labels: []};
}

exports.parseTitle = parseTitle;
exports.parseTitleWithDefaults = parseTitleWithDefaults;
