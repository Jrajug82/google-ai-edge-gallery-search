#!/usr/bin/env node

async function performSearch() {
  const query = process.argv.slice(2).join(' ');
  if (!query) return;

  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        // This is the "Magic" header that stops the 403/Search Failed error
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      process.stdout.write(`Error: DDG returned status ${response.status}`);
      return;
    }

    const data = await response.json();

    // Matching the exact keys seen in your browser screenshot (Image 9)
    if (data.AbstractText) {
      process.stdout.write(`[Source: ${data.AbstractSource}]\n${data.AbstractText}`);
    } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      const snippets = data.RelatedTopics
        .filter(t => t.Text)
        .slice(0, 3)
        .map((t, i) => `${i + 1}. ${t.Text}`)
        .join("\n\n");
      process.stdout.write(snippets);
    } else {
      process.stdout.write("DuckDuckGo returned an empty result for this specific query.");
    }

  } catch (error) {
    process.stdout.write("Network Error: Could not reach DuckDuckGo API.");
  }
}

performSearch();