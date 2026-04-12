#!/usr/bin/env node

async function performSearch() {
  const query = process.argv.slice(2).join(' ');
  if (!query) return;

  // Formatting for the specific Instant Answer API
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&skip_disambig=1`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        // This User-Agent is the most critical part to avoid the 403 error
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://duckduckgo.com/'
      }
    });

    if (!response.ok) {
      process.stdout.write(`DDG Error: ${response.status} - Try using your SearXNG skill instead.`);
      return;
    }

    const data = await response.json();
    let output = "";

    // Priority 1: Abstract (Wikipedia style)
    if (data.AbstractText) {
      output = `[Source: ${data.AbstractSource}]\n${data.AbstractText}`;
    } 
    // Priority 2: Related Topics (Snippets)
    else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      output = data.RelatedTopics
        .filter(t => t.Text)
        .slice(0, 3)
        .map((t, i) => `${i + 1}. ${t.Text}`)
        .join("\n\n");
    }

    if (!output) {
      process.stdout.write("DuckDuckGo has no Instant Answer for this. Try a broader term.");
    } else {
      process.stdout.write(output);
    }

  } catch (error) {
    process.stdout.write("Diagnostic: Network timeout or SSL issue in the tool sandbox.");
  }
}

performSearch();