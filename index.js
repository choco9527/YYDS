const puppeteer = require('puppeteer');
const {getPath,randomFrom} = require('./js/tools');

(async () => {
    try {
        console.log('正在启动 Chromium')
        const extendUrl = 'extension/yyds'
        const options = {
            headless: false,
            args: [`--disable-extensions-except=${getPath(extendUrl)}`]
        }
        const browser = await puppeteer.launch(options);
        const page = await browser.newPage();

        const url = 'https://www.baidu.com'
        await page.goto(url);

        const dimensions = await page.evaluate(() => {
            return {
                width: document.querySelector('#wrapper').clientWidth,
                height: document.querySelector('#wrapper').clientHeight,
            };
        });
        const {width, height} = dimensions
        await page.setViewport({width, height})

        setInterval(async ()=>{
            await page.mouse.click(randomFrom(100,500), randomFrom(100,500));
        },1000)

        // await browser.close();
    } catch (e) {
        console.warn(e);
    }
})();
