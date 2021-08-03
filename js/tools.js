const K = 4

function getPath(path) {
    return __dirname + '/../' + path
}

function randomNumber(min = 0, max = 0, Int = true) // random Int / Float
{
    return Int ? Math.floor(Math.random() * (max - min + 1) + min) :
        Math.random() * (max - min) + min
}

function randn_bm() { // 取 0-1 服从正态分布
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
    return num;
}

function getCircleArea(r = 10) { // get area by xy for circle
    const cX = randomNumber_mb(-r, r) // x position
    const maxY = Math.sqrt(r * r - cX * cX) //  -maxY —— +maxY
    const cY = randomNumber_mb(-maxY, maxY)
    return {cX, cY}
}

function easeOutCirc(x = 0) { // 变量 x 表示 0（动画开始）到 1（动画结束）范围内的值。
    return Math.sqrt(1 - Math.pow(x - 1, 2));
}

function randomNumber_mb(min = 0, max = 0) { // 服从正态分布的随机取值
    return Math.floor(randn_bm() * (max - min + 1) + min)
}


async function mockDrag({page = null, x1 = 0, y1 = 0, x2 = 0, y2 = 0, duration = 1000, r = 50}) { // a new drag
    if (!page) throw new Error('no page')
    const {cX, cY} = getCircleArea(r)
    const {cX: cX2, cY: cY2} = getCircleArea(r)
    x1 = x1 + cX
    y1 = y1 + cY // 起点漂移
    x2 = x2 + cX2
    y2 = y2 + cY2 // 终点漂移
    const dx = x2 - x1
    const dy = y2 - y1
    let rate = 0
    await page.mouse.move(x1, y1)
    await page.mouse.down()
    const interId = setInterval(async () => {
        const r = easeOutCirc(rate)
        await page.mouse.move(x1 + dx * r, y1 + dy * r)
        rate += 30 / 1000
    }, 30)
    setTimeout(async () => {
        clearInterval(interId)
        await page.mouse.up()
    }, duration)
}

async function mockClick({page = null, x = 0, y = 0, clickTimes = 1, r = 10}) { // a new click loop
    if (!page) throw new Error('no page')
    const loopClick = async (loopClickTimes = 1) => {
        // create loopClick
        const {cX, cY} = getCircleArea(r)
        if (loopClickTimes < 1) return
        let times = randomNumber(1, loopClickTimes), timing = 0
        const dispatchTimeClick = async (x = 0, y = 0, frequency = randomNumber(150, 300)) => { // create a frequency click
            return new Promise(resolve => {
                const t = setTimeout(async () => {
                    await click(cX, cY)
                    resolve(t)
                }, frequency)
            })
        }
        while (timing < times) {
            timing++
            await dispatchTimeClick(x, y)
        }
    }

    const click = async (cX = 0, cY = 0) => { // just once click
        console.log('click:', x + cX, y + cY)
        await page.mouse.click(x + cX, y + cY, {delay: randomNumber(0, 10)})
    }

    await loopClick(clickTimes) // 一轮点击时长 = 次数：loopClickTimes × (频率：frequency + 点击延时：delay)
    return Promise.resolve('success')
}

function _similarImg(d1, d2, position = undefined, deviation = 5) { // 计算相似度 误差值 position: 比较部分
    const data1 = position ? _getAreaData(d1, position) : d1
    const data2 = position ? _getAreaData(d2, position) : d2
    if (!data1 || !data2) throw new Error('no img')
    const len1 = data1.length, len2 = data2.length
    // console.log(len1, len2);
    let count = 0
    for (let i = 0; i < len1; i++) {
        if (data1[i] === data2[i]) {
            count++
        } else if (-deviation < data1[i] - data2[i] && data1[i] - data2[i] < deviation) { // 误差容错
            count++
        }
    }

    return {simi: count / len1}
}

function _parsePostData(request) {
    const {_headers} = request
    if (_headers['custom-info'] === 'yyds') {
        const postData = {}
        request.postData().split('&').forEach(item => {
            const arr = item.split('=')
            postData[arr[0]] = arr[1]
        })
        return postData
    }
    return null
}

function _grayData(data) { // 灰化
    const l = data.length;
    const arr = []
    for (let i = 0; i < l; i += 4) { // Gray scale
        const avg = ((data[i] + data[i + 1] + data[i + 2]) / 3) << 0;
        arr.push(avg)
    }
    return arr
}

function _get2dData(arr1d = [], width = 0, height = 0) { // 2维化
    const arr2d = [] // to 2d arr
    for (let i = 0; i < height; i++) {
        const a = arr1d.slice(i * width, (i + 1) * width)
        arr2d.push(a)
    }
    return arr2d
}

function _getAreaData(data, {x1 = 0, x2 = 0, y1 = 0, y2 = 0}) {
    if (!x1 && !x2 && !y1 && !y2) return []
    /* x1=1 x2=2 y1=1 y2=2
    * [0,0,0,0,0,0,0,0,0]  ->  [0, 0,0 ]   ->  [0,0,0,0]
    *                          [0,|0,0|]
    *                          [0,|0,0|]
    * */
    const width = 960 / K
    const height = 540 / K
    const data2d = _get2dData(data, width, height)

    let arr = []
    for (let i = 0; i < height; i++) {
        if (y1 <= i && i <= y2) {
            arr = arr.concat(data2d[i].slice(x1, x2 + 1))
        }
    }
    return arr // 返回的是一维数组
}

function _compareImg(dataBig, data) { // 比较算法 得出是否包含、所在位置（废弃）
    const bigLen = dataBig.length, len = data.length
    const resData = []
    if (dataBig && data && bigLen > 0 && len > 0) {
        let j = 0
        for (let i = 0; i < bigLen; i++) {
            const rowBig = dataBig[i]
            const stringBigRow = rowBig.join('')
            const row = data[j]
            if (row) {
                const stringRow = row.join('')
                const idx = stringBigRow.indexOf(stringRow) // 图2的行出现在图1
                if (idx > 0) {
                    resData.push([i, idx])
                    j++
                }
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

module.exports = {getPath, mockClick, mockDrag, _parsePostData, _grayData, _similarImg, randn_bm, K};

