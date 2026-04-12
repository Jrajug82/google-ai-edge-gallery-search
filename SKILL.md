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
3. Wait for the search result to return before answering the user.
4. If no result is found, state that you cannot find live data.

## Constraints
- Keep queries under 5 words.
- Cite the source if an 'AbstractSource' is provided.