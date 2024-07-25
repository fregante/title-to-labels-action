const {parseTitle} = require('./parse-title');

test('ignores valid title', async () => {
	const output = parseTitle('Hello world', {
		keywords: ['bug'],
	});
	expect(output).toMatchObject({
		title: 'Hello world',
		labels: [],
	});
});

test('Drops keyword with semicolon', async () => {
	const output = parseTitle('Bug: things are broken', {
		keywords: ['bug'],
	});
	expect(output).toMatchObject({
		title: 'Things are broken',
		labels: [],
	});
});

test('Drops keyword with brackets', async () => {
	const output = parseTitle('[Bug] things are broken', {
		keywords: ['bug'],
	});
	expect(output).toMatchObject({
		title: 'Things are broken',
		labels: [],
	});
});

test('Drops keyword with dash', async () => {
	const output = parseTitle('Bug - things are broken', {
		keywords: ['bug'],
	});
	expect(output).toMatchObject({
		title: 'Things are broken',
		labels: [],
	});
});

test('Drops keyword in string with multiple unrelated separators', async () => {
	const output = parseTitle('Bug - a[href] is broken(-ish)', {
		keywords: ['bug'],
	});
	expect(output).toMatchObject({
		title: 'A[href] is broken(-ish)',
	});
});

test('Drops keyword that has space', async () => {
	const output = parseTitle('Bug report: things are broken', {
		keywords: ['bug report'],
	});
	expect(output).toMatchObject({
		title: 'Things are broken',
		labels: [],
	});
});

test('Drops keyword regardless of case', async () => {
	const output = parseTitle('bug: things are broken', {
		keywords: ['Bug'],
	});
	expect(output).toMatchObject({
		title: 'Things are broken',
		labels: [],
	});
});

test('Supports multiple keyword', async () => {
	const output = parseTitle('Bug report: things are broken', {
		keywords: ['bug report', 'bug'],
	});
	expect(output).toMatchObject({
		title: 'Things are broken',
		labels: [],
	});
});

test('Adds specified label', async () => {
	const output = parseTitle('Feature request - cool things', {
		keywords: ['Feature request'],
		labels: ['enhancement'],
	});
	expect(output).toMatchObject({
		title: 'Cool things',
		labels: ['enhancement'],
	});
});
