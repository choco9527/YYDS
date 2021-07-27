const puppeteer = require('puppeteer-core');
const {createCanvas, loadImage} = require('canvas')
const dotenv = require("dotenv")
dotenv.config()
const {getPath, mockClick, _parsePostData, _similarImg} = require('./js/tools');

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
            page1.on('request', async request => {
                const postData = _parsePostData(request)
                if (postData && postData.code + '' === '0' && postData.type === 'pageHandle') {
                    if (postData.msg === 'inputPhone' && process.env.PHONE) { // 输入手机号
                        await page1.mouse.click(495, 295)
                        await page1.keyboard.type(process.env.PHONE, {delay: 100})
                        await page1.mouse.click(480, 365)
                    }
                }
            })
            return Promise.resolve({page1, browser})
        }

        async function getPage() { // get page
            pages = await browser.pages()
            for (let i = 0; i < pages.length; i++) {
                const p = pages[i]
                if (p.url() === 'about:blank') await p.close()
                if (p.url().includes('cg.163.com/run.html') || p.url().includes('youmi')) {
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
                const postData = _parsePostData(request)
                if (postData && postData.code + '' === '0') {
                    if (postData.type === 'play') {
                        await playing(postData.msg)
                    }
                }
            })
        }

        const playingList = []
        const pageMap = {
            'yuhun': [{
                name: '御魂选择页',
                path: 'img/yys/pages/yuhun/yuhun_out.png',
                x: 200,
                y: 320,
                clickTimes: 1,
                simi: 0.6
            },
                {name: '挑战选择页（单刷）', path: 'img/yys/pages/yuhun/select.png', x: 870, y: 485, clickTimes: 3, simi: 0.7},
                {name: '御魂组队页', path: 'img/yys/pages/yuhun/zudui.png', x: 200, y: 320, clickTimes: 1, simi: 0.7},
                {name: '御魂结束页', path: 'img/yys/pages/yuhun/finish.png', x: 700, y: 400, clickTimes: 5, simi: 0.45}]
        }

        async function playing(type = '') { // loop playing
            if (!type) return
            const item = {type, play: true}

            for (let i = 0; i < playingList.length; i++) {
                const item = playingList[i]
                if (item.type === type) {
                    console.log(type + '-停止')
                    clearInterval(item.intervalId) // 关闭监听
                    return
                }
            }
            if (!pageMap[type]) throw new Error('no this type')

            item.intervalId = setInterval(async () => {
                const videoData = await _getVideoData()
                for (let i = 0; i < pageMap[type].length; i++) {
                    const pItem = pageMap[type][i]
                    const compareData = await _getImageData(pItem.path)
                    const compareRes = _similarImg(videoData, compareData)
                    console.log(compareRes)
                    if (compareRes.simi > pItem.simi) {
                        console.log(pItem.name);
                        await mockClick({page, x: pItem.x, y: pItem.y, clickTimes: pItem.clickTimes})
                    }
                }
            }, 2500)

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
