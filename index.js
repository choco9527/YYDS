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
            const url = urls[3]
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
                    console.log('postData', postData);
                    if (postData.msg) {
                        compareImg(postData)
                    }
                }
            })
        }

        async function compareImg(data) {
            const canvasData = await page.evaluate(() => {
                const canvasEle = document.getElementById('yyds-canvas')
                const ctx = canvasEle.getContext('2d')
                let frame = ctx.getImageData(0, 0, canvasEle.width, canvasEle.height);
                const data = frame.data
                const l = data.length;
                const arr = []
                for (let i = 0; i < l; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = avg; // red
                    data[i + 1] = avg; // green
                    data[i + 2] = avg; // blue
                    arr.push(avg)
                }
                const arr2d = [] // into 2d arr
                for (let i = 0; i < canvasEle.height; i++) {
                    const a = arr.slice(i * canvasEle.width, (i + 1) * canvasEle.width)
                    arr2d.push(a)
                }
                return Promise.resolve(arr2d)
            })
            console.log(canvasData);

            // await browser.close();
        }

    } catch (e) {
        console.warn(e);
    }
})();
