# title-to-labels-action

> Cleans up the titles of issues and PRs from common opening keywords

GitHub offers issue templates with pre-defined labels, but that doesn't stop users from cluttering the titles with the same piece of information already offered by labels.

This Action can remove the specified keywords at the beginning of issue titles and optionally add related labels in their place.

Title examples:

User title | Output
--- | ---
Bug - some error happened | Some error happened <br> label: bug
[Feature request] prepare coffee | Prepare coffee <br> labels: enhancement
Suggestion: add more tags | Add more tags

**Note:** keywords are only recognized if followed by one of these characters: `:-)]`
Spaces are automatically trimmed.

## Usage

```yaml
name: Labeler
on:
  issues:
    types:
      - opened
      - edited

jobs:
  Label:
    runs-on: ubuntu-latest
    steps:
      - uses: fregante/title-to-labels-action@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          # Either use one keyword per line or comma-separed values
          # NOTE: do not use lists starting with `-`, Actions doesn't support them
          keywords: |
            feature request
            enhancement
      - uses: fregante/title-to-labels-action@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          keywords: bug, bug report
          labels: bug
```

## Inputs

- `keywords` - The keywords to look for, separed by comma or newline. Case-insensitive.
- `labels` - The labels to apply when one of the keywords was found. Optional.

Either use one keyword per line or comma-separed values.
**Note:** do not use lists starting with `-`, Actions doesn't support them.

Examples:

```yaml
      - uses: fregante/title-to-labels-action@v1
        with:
          keywords: |
            feature request
            suggestions
            enhancement
          labels: |
            enhancement
```
```yaml
      - uses: fregante/title-to-labels-action@v1
        with:
          keywords: bug, bugs, bug report
          labels: bug
```

## Outputs

None.
