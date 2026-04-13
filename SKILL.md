---
name: web_search
description: "Executes a real-time web search for Telangana news, stamp duty, and property laws using DuckDuckGo."

## Instructions

Call the `run_js` tool with the following exact parameters:
- script name: ./scripts/index.html
- data: A JSON string with the following field:
- text: String. The text to calculate hash for.

actions:
  - name: web_search
    description: "Search the internet for current information"
    parameters:
      - name: query
        type: string
        description: "The search keywords"
        required: true
---


# Web Search Skill
1. **Trigger:** Use this skill whenever the user asks about current events, local Hyderabad news, or real-time property data.
2. **Action:** Call the `web_search` action with a specific, optimized search query.
3. **Processing:** Read the JSON text returned by the HTML tool, summarize the top results, and provide the sources clearly.
4. **Instruction:** If the user asks for "stamp duty", automatically search for "Telangana property registration and stamp duty charges 2026".