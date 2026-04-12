#!/usr/bin/env node

async function performSearch() {
  let query = process.argv.slice(2).join(' ');
  
  if (!query) {
    process.stdout.write("No search query provided.");
    process.exit(0);
  }

  // AUTO-FIX: Fix the "02226" year hallucinations
  query = query.replace(/\d{5,}/g, "2026").replace(/te[nl]e?gana/gi, "Telangana");

  // DuckDuckGo Instant Answer API
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    let output = "";

    // 1. Direct Answer
    if (data.AbstractText) {
      output = `Source: ${data.AbstractSource}\n\n${data.AbstractText}`;
    } 
    // 2. Fallback: Related Topics (Good for general terms like 'Telangana')
    else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      const snippets = data.RelatedTopics
        .filter(t => t.Text)
        .slice(0, 3)
        .map((t, i) => `[${i + 1}] ${t.Text}`)
        .join("\n\n");
      output = snippets || "No specific details found. Try a more specific query.";
    } else {
      output = "DuckDuckGo has no instant answer for: " + query;
    }

    process.stdout.write(output);

  } catch (error) {
    process.stdout.write("Error: Network timeout or DuckDuckGo API unreachable.");
  }
}

performSearch();