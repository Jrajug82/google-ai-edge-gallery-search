---
name: search
description: "Search the internet for real-time information, laws, and prices."
actions:
  - name: web_search
    description: "Performs a live web search using DuckDuckGo"
    parameters:
      - name: query
        type: string
        description: "The search keywords"
        required: true
---

# Web Search Skill

## Instructions
1. When asked about facts in 2026, property laws, or local prices, identify search keywords.
2. Execute the `web_search` action.
3. **Wait** for the search result to return from the script before answering.
4. If the result is empty or says "No results," try one more search with broader terms.
5. Present the found data or snippets to the user.

## Constraints
- Max 2 search attempts per turn.
- Cite the source if 'Source:' is provided in the output.