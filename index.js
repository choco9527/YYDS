const puppeteer = require('puppeteer-core');
const {createCanvas, loadImage} = require('canvas')
const dotenv = require("dotenv")
dotenv.config()
const {getPath, mockClick, _getCtx2dData, _compareImg} = require('./js/tools');

(async () => {
    try {
        const {browser} = await openIt() // 打开页面
        let pages = await browser.pages()
        let page = null

        async function openIt() {
            console.log('正在启动 Chrome')
            const extendUrl = 'extension/yyds'
            const options = {
                headless: false,
                args: [`--disable-extensions-except=${getPath(extendUrl)}`, "--window-position=0,0", `--window-size=960,700`],
                defaultViewport: {width: 960, height: 540},
                // devtools: true,
                executablePath: process.env.CHROME_PATH
            }
            const browser = await puppeteer.launch(options);
            const page1 = await browser.newPage();

            const urls = [
                'https://cg.163.com/index.html#/mobile', // 云游戏
                'https://cg.163.com/#/search?key=%E9%98%B4%E9%98%B3%E5%B8%88', // 阴阳师
                'https://www.baidu.com',
                'https://aso.youmi.net'
            ]
            const url = urls[1]
            await page1.goto(url);
            return Promise.resolve({page1, browser})
        }

        async function getPage() { // get page
            pages = await browser.pages()
            for (let i = 0; i < pages.length; i++) {
                const p = pages[i]
                if (p.url() === 'about:blank') await p.close()
                if (p.url().includes('cg.163.com/run.html')) {
                    page = p
                }
                if (p.url().includes('baidu')) {
                    page = p
                }
            }
        }

        async function listenIt() { // 循环获取 -> 监听页面
            if (!page) {
                console.log('loadingPage-' + (Date.now() + '').slice(8, 10))
                setTimeout(async () => {
                    await getPage()
                    await listenIt()
                }, 1000)
                return
            }
            console.log('getPage-' + page.url());
            await page.exposeFunction('_getCtx2dData', _getCtx2dData)

            page.on('request', async request => {
                const {_headers} = request
                if (_headers['custom-info'] === 'yyds') {

                    const postData = {}
                    request.postData().split('&').forEach(item => {
                        const arr = item.split('=')
                        postData[arr[0]] = arr[1]
                    })
                    if (postData.code + '' === '0') {

                        const bigData = await _getVideoData()
                        console.log(bigData);
                        const smallData = await _getImageData('img/yys/USER2.png')

                        // const bigData = await _getImageData('img/test/interface.png')
                        // const smallData = await _getImageData('img/yys/BA-QI-DA-SHE.png')

                        console.time()
                        const compareRes = await _compareImg(bigData, smallData)
                        console.log(compareRes);
                        console.timeEnd()
                        if (compareRes.isTrust) {
                            await mockClick({page, x: compareRes.position.left, y: compareRes.position.top})
                        }
                    }
                }
            })
        }

        const playingList = []

        async function playing(type = '') { // loop playing
            if (!type) return
            for (let i = 0; i < playingList.length; i++) {
                const item = playingList[i]
                if (item.type === type) {
                    clearInterval(item.intervalId) // 关闭监听
                    return
                }
            }

            const intervalId = setInterval(() => {

            }, 200)

            playingList.push({type, play: true, intervalId})
            const res = {imgPath: ''}
        }

        async function _getVideoData() {
            return await page.evaluate(async () => {
                const canvasEle = document.getElementById('yyds-canvas')
                const ctx = canvasEle.getContext('2d')
                // ctx.imageSmoothingEnabled = false // 锐化
                let frame = ctx.getImageData(0, 0, canvasEle.width, canvasEle.height);
                const _getCtx2dData = (frame = null, width = 0, height = 0) => {
                    if (!frame) throw new Error('no frame')
                    const data = frame.data
                    const l = data.length;
                    const arr = []
                    for (let i = 0; i < l; i += 4) { // Gray scale
                        const avg = ((data[i] + data[i + 1] + data[i + 2]) / 3) << 0;
                        arr.push(avg)
                    }
                    const arr2d = [] // to 2d arr
                    for (let i = 0; i < height; i++) {
                        const a = arr.slice(i * width, (i + 1) * width)
                        arr2d.push(a)
                    }
                    return arr2d
                }
                const arr2d = _getCtx2dData(frame, canvasEle.width, canvasEle.height)
                return Promise.resolve(arr2d)
            })
        }

        async function _getImageData(path = '', scale = false) {
            if (!path) throw new Error('no path')
            const img = await loadImage(getPath(path))
            const canvas = createCanvas(img.width, img.height)
            const ctx = canvas.getContext('2d')
            // ctx.imageSmoothingEnabled = false // 锐化
            ctx.drawImage(img, 0, 0, img.width, img.height)
            let frame = ctx.getImageData(0, 0, img.width, img.height);
            return _getCtx2dData(frame, img.width, img.height)
        }

        await listenIt() // 监听页面

    } catch (e) {
        console.warn(e);
    }
})();
