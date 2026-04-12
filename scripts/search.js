#!/usr/bin/env node

async function performSearch() {
  const args = process.argv.slice(2);
  let query = args.join(' ');
  
  if (!query) {
    process.stdout.write("Error: No query provided.");
    return;
  }

  // Handle year hallucinations
  query = query.replace(/\d{5,}/g, "2026");

  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      process.stdout.write(`Search failed with status: ${response.status}`);
      return;
    }

    const data = await response.json();
    let finalOutput = "";

    // 1. Check for Abstract (Direct Answer)
    if (data.AbstractText) {
      finalOutput = `[Source: ${data.AbstractSource}]\n${data.AbstractText}`;
    } 
    // 2. Check for Related Topics (List of results)
    else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      const results = data.RelatedTopics
        .filter(t => t.Text)
        .slice(0, 3)
        .map((t, i) => `${i + 1}. ${t.Text}`)
        .join("\n\n");
      finalOutput = results;
    }

    // 3. Last Resort
    if (!finalOutput) {
      process.stdout.write("No specific results found for this query in DuckDuckGo.");
    } else {
      // Ensure we send a clean string
      process.stdout.write(String(finalOutput).trim());
    }

  } catch (error) {
    process.stdout.write("Error: Connection timeout or Network error.");
  }
}

performSearch();