const {parseTitle} = require('./parse-title');

test('ignores valid title', async () => {
	const output = parseTitle('Hello world', {
		keywords: ['bug']
	});
	expect(output).toMatchObject({
		title: 'Hello world',
		labels: []
	});
});

test('Drops keyword with semicolon', async () => {
	const output = parseTitle('Bug: things are broken', {
		keywords: ['bug']
	});
	expect(output).toMatchObject({
		title: 'Things are broken',
		labels: []
	});
});

test('Drops keyword with brackets', async () => {
	const output = parseTitle('[Bug] things are broken', {
		keywords: ['bug']
	});
	expect(output).toMatchObject({
		title: 'Things are broken',
		labels: []
	});
});

test('Drops keyword with dash', async () => {
	const output = parseTitle('Bug - things are broken', {
		keywords: ['bug']
	});
	expect(output).toMatchObject({
		title: 'Things are broken',
		labels: []
	});
});

test('Drops keyword that has space', async () => {
	const output = parseTitle('Bug report: things are broken', {
		keywords: ['bug report']
	});
	expect(output).toMatchObject({
		title: 'Things are broken',
		labels: []
	});
});

test('Drops keyword regardless of case', async () => {
	const output = parseTitle('bug: things are broken', {
		keywords: ['Bug']
	});
	expect(output).toMatchObject({
		title: 'Things are broken',
		labels: []
	});
});

test('Supports multiple keyword', async () => {
	const output = parseTitle('Bug report: things are broken', {
		keywords: ['bug report', 'bug']
	});
	expect(output).toMatchObject({
		title: 'Things are broken',
		labels: []
	});
});

test('Adds specified label', async () => {
	const output = parseTitle('Feature request - cool things', {
		keywords: ['Feature request'],
		labels: ['enhancement']
	});
	expect(output).toMatchObject({
		title: 'Cool things',
		labels: ['enhancement']
	});
});


test('Handles long titles', async () => {
	const output = parseTitle('Feature request: On hover over PR “Files changed” tab, show a popup with the list of files', {
		keywords: ['feature request']
	});
	expect(output).toMatchObject({
		title: 'On hover over PR “Files changed” tab, show a popup with the list of files',
		labels: ['enhancement']
	});
});
