const puppeteer = require('puppeteer-core');
const {createCanvas, loadImage} = require('canvas')
const dotenv = require("dotenv")
dotenv.config()
const {getPath, mockClick} = require('./js/tools');

(async () => {
    try {
        const {page, browser} = await openIt() // 打开页面
        await listenIt()
        await getImageData('img/BOSS.png')

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
                'https://www.google.com',
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
                    if (postData.code + '' === '0') {
                        console.log('postData', postData);
                        compareImg(postData)
                    }
                }
            })
        }

        async function getVideoData() {
            return await page.evaluate(() => {
                const canvasEle = document.getElementById('yyds-canvas')
                const ctx = canvasEle.getContext('2d')
                let frame = ctx.getImageData(0, 0, canvasEle.width, canvasEle.height);
                const arr2d = getCtx2dData(frame, canvasEle.width, canvasEle.height)
                return Promise.resolve(arr2d)
            })
        }

        async function getImageData(path='') {
            if (!path) throw new Error('no path')
            const img = await loadImage(getPath(path))
            const canvas = createCanvas(img.width, img.height)
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, img.width, img.height)
            let frame = ctx.getImageData(0, 0, img.width, img.height);
            const arr2d = getCtx2dData(frame, img.width, img.height)
        }

        function getCtx2dData(frame=null,width=0,height=0) {
            if (!frame) throw new Error('no frame')
            const data = frame.data
            const l = data.length;
            const arr = []
            for (let i = 0; i < l; i += 4) {
                const avg = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
                data[i] = avg; // red
                data[i + 1] = avg; // green
                data[i + 2] = avg; // blue
                arr.push(avg)
            }
            const arr2d = [] // into 2d arr
            for (let i = 0; i < height; i++) {
                const a = arr.slice(i * width, (i + 1) * width)
                arr2d.push(a)
            }
            return arr2d
        }

        async function compareImg(data) {
            const videoData = await getVideoData()
            const imgData = await getImageData()
        }

    } catch (e) {
        console.warn(e);
    }
})();
