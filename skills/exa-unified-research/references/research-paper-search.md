# Research Paper Search

## Tool Restriction

ONLY use `web_search_advanced_exa` with `category: "research paper"`.

## Filter Support

This category supports domain/date/text filters.

Array-size restriction:
- `includeText` / `excludeText` must be single-item arrays

### When to Use `includeText`

Use `includeText` when the user cares about a specific technique, algorithm, or term appearing in the paper text — for example, `"chain-of-thought"`, `"reinforcement learning"`, `"transformer"`. It helps narrow results to papers that actually discuss the term, not just mention it in passing. Always wrap in a single-item array: `["chain-of-thought"]`.

Combine with `includeDomains` to double-filter: e.g., `includeDomains: ["arxiv.org", "openreview.net"]` + `includeText: ["chain-of-thought"]` returns papers on arXiv/OpenReview that discuss chain-of-thought.

## Supported Inputs

- Core: `query`, `numResults`, `type`
- Domain: `includeDomains`, `excludeDomains`
- Date: `startPublishedDate`, `endPublishedDate`, `startCrawlDate`, `endCrawlDate`
- Text: `includeText`, `excludeText` (single-item arrays)
- Extraction: highlights/summary/context controls
- Additional: `userLocation`, `moderation`, `additionalQueries`, `livecrawl`, `subpages`

## Examples

Recent papers:
```json
{
  "query": "transformer attention mechanisms efficiency",
  "category": "research paper",
  "startPublishedDate": "2024-01-01",
  "numResults": 15,
  "type": "auto"
}
```

Venue-targeted:
```json
{
  "query": "large language model agents",
  "category": "research paper",
  "includeDomains": ["arxiv.org", "openreview.net"],
  "includeText": ["LLM"],
  "numResults": 20,
  "type": "deep"
}
```
