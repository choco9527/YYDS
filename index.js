const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('正在启动 Chromium')
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        const url = 'https://cg.163.com/#/mobile'
        console.log('go to :' + url)
        await page.goto(url);
    } catch (e) {
        console.warn(e);
    }
})();
