# title-to-labels-action

> Cleans up the titles of issues and PRs from common opening keywords

GitHub offers issue templates with pre-defined labels, but that doesn't stop users from cluttering the titles with the same piece of information already offered by labels.

This action:

- removes the specified keywords at the beginning of issue titles;
- _optionally_ add related labels.

You can either run it without inputs to use its [defaults](defaults.json) or specify your own keywords/labels combination.

Title examples:

<table>
  <tr>
    <th>User title
    <th>➡️ Updated title
    <th>➡️ Added labels
  <tr>
    <td>Bug - some error happened
    <td>Some error happened
    <td><code>bug</code> <code>triage</code>
  <tr>
    <td>[Feature request] prepare coffee
    <td>Prepare coffee
    <td><code>enhancement</code>
  <tr>
    <td>Suggestion: add more tags
    <td>Add more tags
    <td><em>none, title-change only</em>
</table>

**Note:** keywords in titles are only recognized if followed by one of these characters: `:-)]`

## Usage

**Note:** If no inputs are supplied, the action will use the [defaults](defaults.json).

```yaml
name: Labeler

on:
  pull_request:
    types: [opened, edited]
  issues:
    types: [opened, edited]

jobs:
  Label:
    runs-on: ubuntu-latest
    steps:
      - uses: fregante/title-to-labels-action@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

You can automatically install the above with [ghat](https://github.com/fregante/ghat):

```sh
npx ghat fregante/title-to-labels-action/workflow
```

## Inputs

**Note:** If no inputs are supplied, the action will use the [defaults](defaults.json).

- `keywords` - The keywords to look for, separed by comma or newline. Case-insensitive.
- `labels` - The labels to apply when one of the keywords was found. Optional.

Either use one keyword per line or comma-separed values.
**Note:** Do not use lists starting with `-`, Actions doesn't support them.

Examples:

```yaml
name: Labeler

on:
  pull_request:
    types: [opened, edited]
  issues:
    types: [opened, edited]

jobs:
  Label:
    runs-on: ubuntu-latest
    steps:
      - uses: fregante/title-to-labels-action@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          keywords: idea
          # If you don't specify `labels`, the action will just clean up the titles from your keywords.

      # The action can be used as many times as needed in a single job
      - uses: fregante/title-to-labels-action@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          keywords: bug, bug report
          labels: bug

      - uses: fregante/title-to-labels-action@v1
        with:
          keywords: |
            feature request
            suggestions
            enhancement
          labels: |
            enhancement
```

## Outputs

None.

## Related

- 🛕 [action-release](https://github.com/fregante/ghatemplates/blob/master/readme.md#action-release) - A workflow to help you release your actions
- [daily-version-action](https://github.com/fregante/daily-version-action) - Creates a new tag using the format Y.M.D, but only if HEAD isn’t already tagged.
- [release-with-changelog](https://github.com/notlmn/release-with-changelog) - Creates reasonable enough GitHub releases for pushed tags, with the commit log as release body.
- [setup-git-user](https://github.com/fregante/setup-git-user) - GitHub Action that sets git user and email to enable commiting
