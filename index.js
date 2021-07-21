const puppeteer = require('puppeteer-core');
const {createCanvas, loadImage} = require('canvas')
const dotenv = require("dotenv")
dotenv.config()
const {getPath, mockClick} = require('./js/tools');

(async () => {
    try {
        const {page, browser} = await openIt() // 打开页面
        await listenIt()

        // const bigData = await _getImageData('img/test/bigtest.png')
        // const smallData = await _getImageData('img/yys/BA-QI-DA-SHE.png')
        // console.time()
        // console.log(bigData, smallData);
        // const res = await _compareImg(bigData, smallData)
        // console.log(res);
        // console.timeEnd()

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

            const urls = [
                'https://cg.163.com/index.html#/mobile',
                'https://cg.163.com/#/search?key=%E9%98%B4%E9%98%B3%E5%B8%88',
                'https://www.google.com',
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
                    if (postData.code + '' === '0') {
                        console.log('postData', postData);
                        // _compareImg(postData)
                    }
                }
            })
        }

        async function _getVideoData() {
            return await page.evaluate(() => {
                const canvasEle = document.getElementById('yyds-canvas')
                const ctx = canvasEle.getContext('2d')
                let frame = ctx.getImageData(0, 0, canvasEle.width, canvasEle.height);
                const arr2d = _getCtx2dData(frame, canvasEle.width, canvasEle.height)
                return Promise.resolve(arr2d)
            })
        }

        async function _getImageData(path = '', scale = false) {
            if (!path) throw new Error('no path')
            const img = await loadImage(getPath(path))
            const canvas = createCanvas(img.width, img.height)
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img,0,0, img.width, img.height)
            let frame = ctx.getImageData(0, 0, img.width, img.height);
            return _getCtx2dData(frame, img.width, img.height)
        }

        function _getCtx2dData(frame = null, width = 0, height = 0) {
            if (!frame) throw new Error('no frame')
            const data = frame.data
            const l = data.length;
            const arr = []
            for (let i = 0; i < l; i += 4) {
                const avg = ((data[i] + data[i + 1] + data[i + 2]) / 3) << 0;
                arr.push(avg)
            }
            const arr2d = [] // into 2d arr
            for (let i = 0; i < height; i++) {
                const a = arr.slice(i * width, (i + 1) * width)
                arr2d.push(a)
            }
            return arr2d
        }

        async function _compareImg(dataBig, data) { // 比较两张图 得出是否包含、所在位置
            const bigLen = dataBig.length, len = data.length
            const resData = []
            if (dataBig && data && bigLen > 0 && len > 0) {
                let j = 0
                for (let i = 0; i < bigLen; i++) {
                    const rowBig = dataBig[i]
                    const stringBigRow = rowBig.join('-')
                    const row = data[j]
                    const stringRow = row.join('-')
                    const idx = stringBigRow.indexOf(stringRow) // 图2的行出现在图1
                    if (idx > 0) {
                        resData.push([i, idx])
                        j++
                    }
                }
                const resLen = resData.length
                if (resLen > (len / 2)) {
                    const top = resData[~~(resLen / 2) + 1][0] // 图2距图1 top
                    const left = resData[~~(resLen / 2) + 1][1] + data[0].length / 2
                    return {isTrust: resLen > (len / 2), position: {top, left}, arr: resData}
                } else {
                    return {isTrust: false, arr: resData}
                }

            } else {
                throw new Error('no data')
            }
        }

    } catch (e) {
        console.warn(e);
    }
})();
