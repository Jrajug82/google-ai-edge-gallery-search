---
name: web_search
description: "Executes a web search for current events and info."
actions:
  - name: web_search
    parameters:
      - name: query
        type: string
        required: true
---

# Instructions
- When `web_search` returns text, read it and summarize it for the user.
- If the tool says "No specific results found", tell the user you couldn't find an instant answer.
- **CRITICAL:** Do not hallucinate. Only use the text provided by the tool.