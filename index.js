const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const {createCanvas, loadImage} = require('canvas')
const dotenv = require("dotenv")
dotenv.config()
const {getPath, mockClick, _parsePostData, _grayData, _similarImg, randn_bm} = require('./js/tools');
const {pageMap} = require('./js/map');
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
                executablePath: process.env.CHROME_PATH,
                ignoreDefaultArgs: ["--enable-automation"]
            }
            const browser = await puppeteer.launch(options);
            const page1 = await browser.newPage();

            const urls = [
                'https://cg.163.com/index.html#/mobile', // 云游戏
                'https://cg.163.com/#/search?key=%E9%98%B4%E9%98%B3%E5%B8%88', // 阴阳师
                'https://www.baidu.com',
                'https://aso.youmi.net',
                'https://bot.sannysoft.com'
            ]
            const url = urls[3]
            await page1.goto(url);
            page1.on('request', async req => {
                const postData = _parsePostData(req)
                if (postData && postData.code + '' === '0' && postData.postType === 'pageHandle') {
                    if (postData.cmd === 'inputPhone' && process.env.PHONE) { // 输入手机号
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
            await page.setRequestInterception(true) // 请求拦截

            page.on('request', async req => {
                const postData = _parsePostData(req)
                if (postData && postData.code + '' === '0' && postData.postType === 'game') {
                    await playing(postData.cmd, req)
                } else {
                    await req.continue()
                }
            })
        }

        const playingList = []

        async function response2page(req, data = null) {
            await req.respond({
                status: 200,
                headers: {'Access-Control-Allow-Origin': '*',},
                contentType: 'application/json; charset=utf-8',
                body: JSON.stringify({code: 0, data}),
            })
            console.log('respond：' + JSON.stringify(data))
        }

        async function playing(gameType = '', req) { // loop playing
            if (!gameType) return
            const item = {gameType, intervalId: 0}

            for (let i = 0; i < playingList.length; i++) {
                const item = playingList[i]
                if (item.gameType === gameType) {
                    await response2page(req, {code: 'stop', msg: '停止'})
                    clearInterval(item.intervalId) // 关闭监听
                    playingList.splice(i, 1)
                    return
                }
            }

            if (playingList.length > 0) {
                await response2page(req, {code: 'elseGame', msg: '请先停止其他正在执行的操作'})
                return
            }

            if (!pageMap[gameType]) {
                await response2page(req, {code: 'noGame', msg: '暂不支持该类型操作'})
                return
            }
            await response2page(req, {code: 'start', msg: '开始'})
            await page.exposeFunction('_grayData', _grayData)
            item.intervalId = setInterval(async () => {
                const videoData = await _getVideoData()
                for (let i = 0; i < pageMap[gameType].length; i++) {
                    const pItem = pageMap[gameType][i]
                    const compareData = await _getImageData(pItem.path)
                    const compareRes = _similarImg(videoData, compareData)
                    if (i === 0) console.log('————')
                    console.log(compareRes.simi);
                    if (compareRes.simi > pItem.simi) {
                        console.log(pItem.name);
                        let index = Math.floor((randn_bm() * pItem.clickMap.length))
                        const {x, y} = pItem.clickMap[index]
                        await mockClick({page, x, y, clickTimes: pItem.clickTimes, r: pItem.r})
                    }
                }
            }, 2500)

            playingList.push(item)
        }

        async function _getVideoData() {
            return page.evaluate(async () => {
                const canvasEle = document.getElementById('yyds-canvas')
                const ctx = canvasEle.getContext('2d')
                ctx.imageSmoothingEnabled = false // 锐化
                let frame = ctx.getImageData(0, 0, canvasEle.width, canvasEle.height);
                const data = Array.from(frame.data)
                const arr = await window._grayData(data)
                return Promise.resolve(arr)
            });
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
            return _grayData(frame.data)
        }

        await listenIt() // 监听页面

    } catch (e) {
        console.warn(e);
    }
})();
