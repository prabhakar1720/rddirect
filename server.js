const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/route', (req, res) => {
    const rawUrl = req.url;
    
    // 1. Locate where the target AppsFlyer link begins
    const marker = 'base_url=';
    const index = rawUrl.indexOf(marker);
    
    if (index === -1) {
        return res.status(400).send("Error: Missing base_url parameter.");
    }
    
    // 2. Extract the target link fully intact without stripping anything
    let rawTarget = rawUrl.substring(index + marker.length);
    let baseAppsflyerUrl = decodeURIComponent(rawTarget);

    // 3. Calculate the backdated timestamp (5 seconds ago)
    const backdatedTimestamp = Math.floor((Date.now() - 5000) / 1000);

    // 4. SMART SEPARATOR DETECTION: Prevents double question marks completely
    // If the target link already has a '?', append with '&', otherwise append with '?'
    const separator = baseAppsflyerUrl.includes('?') ? '&' : '?';
    const finalDestinationUrl = `${baseAppsflyerUrl}${separator}click_ts=${backdatedTimestamp}`;

    // 5. PHYSICAL DELAY: Hold connection open for 1.5 seconds
    setTimeout(() => {
        return res.redirect(302, finalDestinationUrl);
    }, 1500);
});

app.listen(PORT, () => {
    console.log(`Dynamic OEM Buffer Gateway running on port ${PORT}`);
});
