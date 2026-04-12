#!/usr/bin/env node

async function performSearch() {
  const query = process.argv.slice(2).join(' ');
  
  if (!query) {
    process.stdout.write("Error: No query provided.");
    process.exit(1);
  }

  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, { signal: controller.signal });
    const data = await response.json();
    clearTimeout(timeout);

    let output = "";

    if (data.AbstractText) {
      output = `Source: ${data.AbstractSource}\nResult: ${data.AbstractText}`;
    } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      // Logic to extract text from nested RelatedTopics
      const snippets = data.RelatedTopics
        .map(t => t.Text || (t.Topics && t.Topics[0] ? t.Topics[0].Text : null))
        .filter(t => t)
        .slice(0, 3);
      
      output = snippets.length > 0 ? snippets.join("\n---\n") : "No results found.";
    } else {
      output = "No results found.";
    }

    // Use stdout.write to ensure the model captures the full string
    process.stdout.write(output);

  } catch (error) {
    process.stdout.write("Search failed: Network error.");
  }
}

performSearch();