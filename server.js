const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/route', (req, res) => {
    // 1. Grab target AppsFlyer link + Affise dynamic macros
    const baseAppsflyerUrl = req.query.base_url; 
    const clickId = req.query.click_id || '';
    const pubId = req.query.pub_id || '';

    // Safety check: if missing base_url, do not crash
    if (!baseAppsflyerUrl) {
        return res.status(400).send("Error: Missing base_url parameter.");
    }

    // 2. MATH MANIPULATION: Backdate the click timestamp by 5 seconds
    const backdatedTimestamp = Math.floor((Date.now() - 5000) / 1000);

    // 3. TARGET CONSTRUCTION: Rebuild the destination link cleanly
    const finalDestinationUrl = `${baseAppsflyerUrl}?af_sub1=${encodeURIComponent(clickId)}&af_sub2=${encodeURIComponent(pubId)}&click_ts=${backdatedTimestamp}`;

    // 4. PHYSICAL DELAY: Force an asynchronous 1.5-second sleep (1500 ms)
    setTimeout(() => {
        // Safe 302 Server redirect for headless OEM loops
        return res.redirect(302, finalDestinationUrl);
    }, 1500);
});

app.listen(PORT, () => {
    console.log(`Custom OEM Dynamic Buffer running on port ${PORT}`);
});
