const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
        page.on('pageerror', error => console.log('BROWSER_ERROR:', error));
        page.on('requestfailed', request => console.log('REQUEST_FAILED:', request.url()));

        await page.goto('http://localhost:5173/admin-login', { waitUntil: 'networkidle0', timeout: 8000 });
        
        await browser.close();
    } catch(e) {
        console.error('SCRIPT_ERROR', e);
    }
})();
