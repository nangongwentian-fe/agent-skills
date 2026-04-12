# Code Search

## Tool Restriction

Only use `web_search_exa`.

## When to Use

Use for:
- API usage and syntax
- SDK/library examples
- configuration and setup patterns
- framework how-to
- debugging with authoritative snippets

## Inputs

- `query` (required)
- `numResults` (optional, default 10)

## Query Patterns

- Always include programming language
- Include framework and version when relevant
- Include exact identifiers (function/class/config key/error text)

## Tuning

Tune `numResults` by user intent (aligns with global query strategy):
- "a few examples": 10-20 results
- "comprehensive": 20-50 results
- explicit number: follow user request

## Deep Reading

When search result snippets are not detailed enough (e.g., you need full code examples, complete API references, or step-by-step tutorials), use `web_fetch_exa` to read the top 2-3 most relevant URLs in full. This is especially useful for:

- Official documentation pages where the key content is in prose, not snippets
- GitHub README files or source files with complete examples
- Blog posts with multi-step walkthroughs

Pattern: search with `web_search_exa` first, then `web_fetch_exa` on the best URLs with `maxCharacters: 8000`.

## Output

1. Minimal working snippet(s)
2. Version constraints and gotchas
3. Source URLs
