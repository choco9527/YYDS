const puppeteer = require('puppeteer-core');
const {createCanvas, loadImage} = require('canvas')
const dotenv = require("dotenv")
dotenv.config()
const {getPath, mockClick, _compareImg, _similarImg} = require('./js/tools');

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
                'https://aso.youmi.net',
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
                if (p.url().includes('youmi')) {
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

            page.on('request', async request => {
                const {_headers} = request
                if (_headers['custom-info'] === 'yyds') {

                    const postData = {}
                    request.postData().split('&').forEach(item => {
                        const arr = item.split('=')
                        postData[arr[0]] = arr[1]
                    })
                    if (postData.code + '' === '0') {
                        console.log(postData);
                        await playing(postData.msg)
                    }
                }
            })
        }

        const playingList = []
        const pageMap = {
            'yuhun': {path: 'img/yys/pages/zudui.png', x: 200, y: 400}
        }

        async function playing(type = '') { // loop playing
            if (!type) return
            const item = {type, play: true}

            for (let i = 0; i < playingList.length; i++) {
                const item = playingList[i]
                if (item.type === type) {
                    clearInterval(item.intervalId) // 关闭监听
                    return
                }
            }
            if (!pageMap[type]) throw new Error('no this type')

            item.intervalId = setInterval(async () => {
                const videoData = await _getVideoData()
                const compareData = await _getImageData(pageMap[type].path)
                const compareRes = _similarImg(videoData, compareData)
                console.log(compareRes);
                if (compareRes.isTrust) {
                    await mockClick({page, x: pageMap[type].x, y: pageMap[type].y})
                }
            }, 200)

            playingList.push(item)
        }

        async function _getVideoData() {
            return await page.evaluate(async () => {
                const canvasEle = document.getElementById('yyds-canvas')
                const ctx = canvasEle.getContext('2d')
                ctx.imageSmoothingEnabled = false // 锐化
                let frame = ctx.getImageData(0, 0, canvasEle.width, canvasEle.height);
                const arr = Array.from(frame.data)
                return Promise.resolve(arr)
            })
        }

        async function _getImageData(path = '', scale = false) {
            if (!path) throw new Error('no path')
            const img = await loadImage(getPath(path))
            const k = 4
            const width = img.width / k, height = img.height / k
            const canvas = createCanvas(width, height)
            const ctx = canvas.getContext('2d')
            ctx.imageSmoothingEnabled = false // 锐化
            ctx.drawImage(img, 0, 0, width, height)
            let frame = ctx.getImageData(0, 0, width, height);
            return frame.data
        }

        await listenIt() // 监听页面

    } catch (e) {
        console.warn(e);
    }
})();
