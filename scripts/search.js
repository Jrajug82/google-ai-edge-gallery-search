#!/usr/bin/env node

async function performSearch() {
  let query = process.argv.slice(2).join(' ');
  
  if (!query) {
    process.stdout.write("No search query provided.");
    process.exit(0);
  }

  // AUTO-FIX: If the model hallucinates the year 02226, 20206, etc.
  query = query.replace(/\d{5}/g, "2026");

  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, { signal: controller.signal });
    const data = await response.json();
    clearTimeout(timeout);

    let output = "";

    // Priority 1: Instant Answers
    if (data.AbstractText) {
      output = `Source: ${data.AbstractSource}\nResult: ${data.AbstractText}`;
    } 
    // Priority 2: Related Topics (News/Lists)
    else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      const results = data.RelatedTopics
        .filter(t => t.Text)
        .slice(0, 5) // Get Top 5 for "today news top 5"
        .map((t, i) => `${i + 1}. ${t.Text}`);
      
      output = results.length > 0 ? results.join("\n") : "No specific news snippets found.";
    } else {
      output = "Search returned no results for: " + query;
    }

    process.stdout.write(output);

  } catch (error) {
    process.stdout.write("Error: Network timeout or connection lost.");
  }
}

performSearch();