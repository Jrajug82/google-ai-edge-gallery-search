#!/usr/bin/env node

async function performSearch() {
  const query = process.argv.slice(2).join(' ');
  if (!query) return;

  // DDG likes lower case sometimes, and no_redirect is key
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&skip_disambig=1`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await response.json();

    let result = "";

    // 1. Try the direct Wikipedia-style abstract
    if (data.AbstractText) {
      result = data.AbstractText;
    } 
    // 2. Fallback: Check 'RelatedTopics' (This is likely where 'Telangana' is hiding)
    else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      // Find the first topic that has text
      const firstTopic = data.RelatedTopics.find(t => t.Text);
      result = firstTopic ? firstTopic.Text : "";
    }

    if (result) {
      process.stdout.write(result);
    } else {
      // This helps you debug—if you see this message, DDG is empty
      process.stdout.write("API returned empty for: " + query);
    }
  } catch (error) {
    process.stdout.write("Diagnostic: Network error.");
  }
}

performSearch();