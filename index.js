const puppeteer = require('puppeteer-extra')
puppeteer.use(require('puppeteer-extra-plugin-open-site-flash')())
const {getPath, randomFrom} = require('./js/tools');

(async () => {
    try {
        await openIt() // 打开页面

        async function openIt() {
            console.log('正在启动 Chromium')
            const extendUrl = 'extension/yyds'
            const options = {
                headless: false,
                args: [
                    `--disable-extensions-except=${getPath(extendUrl)}`,
                    "--window-position=0,0"
                ]
            }
            const browser = await puppeteer.launch(options);

            const page = await browser.newPage();

            const urls = ['https://www.bilibili.com/video/BV13Z4y137Kt?from=search&seid=14938727801566765673',
                'https://aso.youmi.net', 'https://cg.163.com/#/mobile']
            const url = urls[0]
            // await browser.flash('https://www.bilibili.com') // open flash

            await page.goto(url);

            const dimensions = await page.evaluate(() => {
                return {
                    width: document.querySelector('body').clientWidth,
                    height: document.querySelector('body').clientHeight,
                };
            });
            const {width, height} = dimensions
            await page.setViewport({width, height})
        }


        // await browser.close();
    } catch (e) {
        console.warn(e);
    }
})();
