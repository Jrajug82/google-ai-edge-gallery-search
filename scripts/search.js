#!/usr/bin/env node

/**
 * Keyless Search Tool (DuckDuckGo)
 * Perfect for local agents on Windows 11/WSL2
 */

async function searchNoKey() {
  // Get query from command line arguments
  const query = process.argv.slice(2).join(' ');
  
  if (!query) {
    console.error("Please provide a search term.");
    process.exit(1);
  }

  // format=json: gives us a machine-readable response
  // no_redirect=1: ensures we stay on the API
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // DuckDuckGo returns an 'Abstract' for well-known topics
    if (data.AbstractText) {
      console.log(`Source: ${data.AbstractSource}`);
      console.log(`Result: ${data.AbstractText}`);
    } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      // Fallback: Use the first related topic snippet
      console.log(`Result: ${data.RelatedTopics[0].Text}`);
    } else {
      console.log("No instant answer found for this query.");
    }
  } catch (error) {
    console.error("Search failed:", error.message);
  }
}

searchNoKey();