#!/usr/bin/env node

async function performSearch() {
  let query = process.argv.slice(2).join(' ');
  if (!query) return;

  // Fix common hallucinations
  query = query.replace(/\d{5,}/g, "2026").replace(/te[nl]e?gana/gi, "Telangana");

  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        // This is the critical part: mimic a browser
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      process.stdout.write(`HTTP Error: ${response.status}`);
      return;
    }

    const data = await response.json();

    let output = "";
    if (data.AbstractText) {
      output = `Source: ${data.AbstractSource}\n\n${data.AbstractText}`;
    } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      output = data.RelatedTopics
        .filter(t => t.Text)
        .slice(0, 3)
        .map((t, i) => `[${i + 1}] ${t.Text}`)
        .join("\n\n");
    }

    // If both are empty, DuckDuckGo doesn't have an "Instant Answer"
    if (!output) {
      process.stdout.write(`DuckDuckGo found no summary for "${query}". Try your SearXNG tool instead.`);
    } else {
      process.stdout.write(output);
    }

  } catch (error) {
    process.stdout.write("Connection failed. Check your phone's internet or Tailscale.");
  }
}

performSearch();