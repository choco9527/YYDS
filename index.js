const puppeteer = require('puppeteer-core');
const dotenv = require("dotenv")
dotenv.config()
const {getPath, mockClick} = require('./js/tools');

(async () => {
    try {
        const {page, browser} = await openIt() // 打开页面
        await listenIt()

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
                'https://xuliangzhan_admin.gitee.io/vxe-table/#/column/api',
                'https://www.bilibili.com/bangumi/play/ss1733?from=search&seid=8552725814323946562',
                'https://aso.youmi.net',
                'https://cg.163.com/#/mobile']
            const url = urls[1]
            await page.goto(url);
            return Promise.resolve({page, browser})
        }

        async function listenIt() { // 监听页面
            page.on('request', request => {
                const {_headers} = request
                if (_headers['custom-info'] === 'yyds') {
                    const postData = {}
                    request.postData().split('&').forEach(item => {
                        const arr = item.split('=')
                        postData[arr[0]] = arr[1]
                    })
                    console.log(postData);
                    if (postData.msg ) {
                        compareImg()
                    }
                }
            })
        }

        async function compareImg(type='') {
            await browser.close();
        }

    } catch (e) {
        console.warn(e);
    }
})();
