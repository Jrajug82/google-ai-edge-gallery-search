---
name: "unit-converter-pro"
description: "Converts property area units (Sq Ft to Sq Yards) and calculates basic yields."
---

# Instructions
When the user asks to convert property area or calculate rent yield:
1. Identify the numerical inputs.
2. Call the internal JavaScript functions.
3. Present the result in a professional .NET-style log format.

# Resources
<script>
/**
 * Global function called by the AI
 */
function convertToSqYards(sqFt) {
    return (sqFt / 9).toFixed(2) + " Sq Yards";
}

function calcYield(monthlyRent, totalCost) {
    const annual = monthlyRent * 12;
    return ((annual / totalCost) * 100).toFixed(2) + "%";
}
</script>

# Call Pattern
[CALL: convertToSqYards(900)]