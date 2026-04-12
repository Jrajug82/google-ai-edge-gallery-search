#!/usr/bin/env node

/**
 * Optimized No-Key Search for Google AI Edge
 * Path: /scripts/search.js
 */

async function runSearch() {
  const query = process.argv.slice(2).join(' ');
  
  if (!query) {
    console.log("No query provided.");
    process.exit(0);
  }

  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1`;

  try {
    // 5-second timeout to prevent the app from hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, { signal: controller.signal });
    const data = await response.json();
    clearTimeout(timeoutId);

    let result = "";
    if (data.AbstractText) {
      result = `Source: ${data.AbstractSource} - ${data.AbstractText}`;
    } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      result = data.RelatedTopics[0].Text;
    } else {
      result = "No instant results found. Try a simpler query.";
    }

    // Crucial: The model reads whatever is printed to console.log
    console.log(result);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log("Search timed out. Please check your internet connection.");
    } else {
      console.log("Search error: Could not reach the internet.");
    }
  }
}

runSearch();