// Validates a specific ID format (e.g., PROP-1234)
function validateTenantID(id) {
    const regex = /^PROP-\d{4}$/;
    return regex.test(id) ? "Valid ID" : "Invalid Format: Must be PROP-xxxx";
}

// Calculates Annual Yield
function calculateYield(monthlyRent, propertyValue) {
    const annualRent = monthlyRent * 12;
    const yieldPercentage = (annualRent / propertyValue) * 100;
    return yieldPercentage.toFixed(2) + "%";
}