---
name: web_search
description: "Search for info on stamp duty, news, and Telangana."
actions:
  - name: web_search
    description: "Execute search"
    parameters:
      - name: query
        type: string
        description: "Search keywords"
        required: true
---

# Instructions for Gemma
1. **FORCE TRIGGER:** If the user mentions "stamp duty" or "news", DO NOT ask clarifying questions. Call `web_search` immediately.
2. If the user is vague (e.g., "stamp duty"), use the query: "Telangana stamp duty registration charges 2026".
3. Always summarize the results and provide the source if available.