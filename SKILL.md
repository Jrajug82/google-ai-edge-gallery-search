---
name: search
description: "Search the internet for real-time information using DuckDuckGo."
actions:
  - name: search
    description: "Performs a web search"
    parameters:
      - name: query
        type: string
        description: "The search terms"
        required: true
---

# Web Search Skill

## Instructions
1. Use this tool for any questions about current events, laws, or prices in 2026.
2. Call the `search` action with a specific query.
3. **CRITICAL:** If the search returns "No results found," try a second search with broader terms (e.g., if "Stamp duty 2026" fails, search for "Telangana property registration rates").
4. Always double-check the year in your query to ensure it is 2026.
5. Wait for the search result to return before answering the user.
6. If no result is found, state that you cannot find live data.
7. **If the results are empty:** The model must try one more time with a broader query (e.g., if "Stamp duty 2026" fails, search "Telangana registration charges").
8. Present the `AbstractText` or snippets found to the user.

## Constraints
- Max 2 search attempts per turn.
- Always cite the source if `AbstractSource` is available.