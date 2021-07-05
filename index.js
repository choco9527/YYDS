const puppeteer = require('puppeteer');

(async () => {
    try{
        console.log('正在启动 Chromium')
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto('https://www.baidu.com');
    }catch (e) {
        console.warn(e);
    }
})();
