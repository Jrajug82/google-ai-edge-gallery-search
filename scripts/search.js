#!/usr/bin/env node

async function performSearch() {
  const query = process.argv.slice(2).join(' ');
  if (!query) {
    process.stdout.write("No query provided.");
    return;
  }

  // Handle hallucinations
  const cleanQuery = query.replace(/\d{5,}/g, "2026");
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(cleanQuery)}&format=json&no_redirect=1`;

  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        // Essential: This tells DDG you are a browser, not a bot
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
        'Accept': 'application/json'
      }
    });

    clearTimeout(id);

    if (!response.ok) {
      process.stdout.write(`HTTP Error ${response.status}: DDG blocked the request.`);
      return;
    }

    const data = await response.json();
    let output = "";

    // Exact mapping from your browser screenshot (Image 9)
    if (data.AbstractText) {
      output = `[Source: ${data.AbstractSource}]\n${data.AbstractText}`;
    } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      output = data.RelatedTopics
        .filter(t => t.Text)
        .slice(0, 3)
        .map((t, i) => `${i + 1}. ${t.Text}`)
        .join("\n\n");
    }

    if (!output) {
      process.stdout.write("DuckDuckGo has no Instant Answer for this. Try your SearXNG tool.");
    } else {
      process.stdout.write(output);
    }

  } catch (error) {
    if (error.name === 'AbortError') {
      process.stdout.write("Search failed: Connection timed out.");
    } else {
      process.stdout.write("Search failed: Network error or CORS block.");
    }
  }
}

performSearch();