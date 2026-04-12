#!/usr/bin/env node

async function performSearch() {
  const query = process.argv.slice(2).join(' ');
  if (!query) return;

  // Use the simplest possible DDG URL
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      // Some sandboxes require this to be explicitly set to 'cors' or 'no-cors'
      mode: 'cors' 
    });

    const text = await response.text(); // Get raw text first to avoid JSON parse errors
    const data = JSON.parse(text);

    if (data.AbstractText) {
      process.stdout.write(data.AbstractText);
    } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      process.stdout.write(data.RelatedTopics[0].Text);
    } else {
      process.stdout.write("No summary found for " + query);
    }
  } catch (error) {
    // This will help us see the REAL error in the logs
    process.stdout.write("Diagnostic: " + error.message);
  }
}

performSearch();