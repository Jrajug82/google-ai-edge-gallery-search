#!/usr/bin/env node

/**
 * google-ai-edge DuckDuckGo Search Fix
 * No API Key Required - Optimized for Mobile
 */

async function performSearch() {
  // Get query from model parameters
  const query = process.argv.slice(2).join(' ');
  
  if (!query) {
    console.log("Error: No search query provided.");
    process.exit(1);
  }

  // Use the 'no_html' and 'skip_disclaim' flags for cleaner data
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`;

  try {
    // 10-second timeout to handle slow mobile data
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, { 
      signal: controller.signal,
      headers: { 'User-Agent': 'GoogleAIEdgeAgent/1.0' }
    });
    
    const data = await response.json();
    clearTimeout(timeout);

    let output = "";

    // Priority 1: Instant Answer (Abstract)
    if (data.AbstractText) {
      output = `[Source: ${data.AbstractSource}]\n${data.AbstractText}`;
    } 
    // Priority 2: Related Topics (Snippets)
    else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      // Filter out objects that don't have a 'Text' property
      const validResults = data.RelatedTopics
        .filter(topic => topic.Text)
        .slice(0, 3)
        .map(topic => topic.Text);
      
      output = validResults.length > 0 ? validResults.join("\n---\n") : "No text results found.";
    } 
    else {
      output = "No results found. Please try a broader search term.";
    }

    // The AI reads whatever is printed to stdout
    process.stdout.write(output);

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log("Search timed out. Check your internet connection.");
    } else {
      console.log("Search failed due to a network error.");
    }
  }
}

performSearch();