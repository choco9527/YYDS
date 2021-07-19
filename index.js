const puppeteer = require('puppeteer-core');
const dotenv = require("dotenv")
dotenv.config()
const {getPath, mockClick} = require('./js/tools');

(async () => {
    try {
        await openIt() // 打开页面

        async function openIt() {
            console.log('正在启动 Chrome')
            const extendUrl = 'extension/yyds'
            const options = {
                headless: false,
                args: [`--disable-extensions-except=${getPath(extendUrl)}`, "--window-position=0,0"],
                defaultViewport: null,
                devtools: true,
                executablePath: process.env.CHROME_PATH
            }
            const browser = await puppeteer.launch(options);

            const page = await browser.newPage();

            const urls = ['https://cg.163.com/#/search?key=%E9%98%B4%E9%98%B3%E5%B8%88',
                'https://www.bilibili.com/video/BV13Z4y137Kt?from=search&seid=14938727801566765673',
                'https://aso.youmi.net',
                'https://cg.163.com/#/mobile']
            const url = urls[2]
            await page.goto(url);

            setInterval(async ()=>{ // 模拟点击
                await mockClick({page:page,x:55, y:55})
            },3000)
        }

        // await browser.close();
    } catch (e) {
        console.warn(e);
    }
})();
