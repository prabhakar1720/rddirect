const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/route', (req, res) => {
    // 1. Grab the raw incoming query string exactly as it left Affise
    const requestUrl = req.url;
    
    // 2. Extract everything after "base_url=" precisely
    const urlParts = requestUrl.split('base_url=');
    if (urlParts.length < 2) {
        return res.status(400).send("Error: Missing base_url parameter.");
    }
    
    // Decode the target link back to its normal shape
    let baseAppsflyerUrl = decodeURIComponent(urlParts[1]);

    // 3. MATH MANIPULATION: Backdate the click timestamp by 5 seconds
    const backdatedTimestamp = Math.floor((Date.now() - 5000) / 1000);

    // 4. CLEAN PARSING: Safely attach the new click_ts parameter
    // If the link already has parameters, append with &, otherwise append with ?
    const separator = baseAppsflyerUrl.includes('?') || baseAppsflyerUrl.includes('&') ? '&' : '?';
    const finalDestinationUrl = `${baseAppsflyerUrl}${separator}click_ts=${backdatedTimestamp}`;

    // 5. PHYSICAL DELAY: Freeze for 1.5 seconds
    setTimeout(() => {
        // Issue clean HTTP 302 redirect
        return res.redirect(302, finalDestinationUrl);
    }, 1500);
});

app.listen(PORT, () => {
    console.log(`Custom OEM Dynamic Buffer running on port ${PORT}`);
});
