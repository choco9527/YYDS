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
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
    return num;
}

function randomNumber_mb(min = 0, max = 0) { // 服从正态分布的随机取值
    return  Math.floor(randn_bm() * (max - min + 1) + min)
}

function getCircleArea(r = 10) { // get area by xy for circle
    const cX = randomNumber_mb(-r, r) // x position
    const maxY = Math.sqrt(r * r - cX * cX) //  -maxY —— +maxY
    const cY = randomNumber_mb(-maxY, maxY)
    return {cX, cY}
}

async function mockClick({page = null, x = 0, y = 0, clickTimes = 1, r = 10}) { // a new click loop
    console.log('a new click loop')
    console.time()

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

    await loopClick(clickTimes)
    console.timeEnd() // 一轮点击时长 = 次数：loopClickTimes × (频率：frequency + 点击延时：delay)
    return Promise.resolve('success')
}

function _similarImg(data1, data2, deviation = 5) { // 计算相似度 误差值
    if (!data1 || !data2) throw new Error('no img')
    const len1 = data1.length, len2 = data2.length
    let count = 0
    for (let i = 0; i < len1; i++) {
        if (data1[i] === data2[i]) {
            count++
        } else if (-deviation < data1[i] - data2[i] && data1[i] - data2[i] < deviation) { // 误差容错
            count++
        }
    }

    return {simi: count / data1.length}
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

function _getCtx2dData(frame = null, width = 0, height = 0) { // 转为2维数组 废弃
    if (!frame) throw new Error('no frame')
    const data = frame.data
    const l = data.length;
    const arr = []
    for (let i = 0; i < l; i += 4) { // Gray scale
        const avg = ((data[i] + data[i + 1] + data[i + 2]) / 3) << 0;
        arr.push(avg)
        // arr.push(avg >= 255 * 0.75 ? 3 : avg >= 255 * 0.5 ? 2 : avg >= 255 * 0.25 ? 1 : 0) // 提取指纹
        // arr.push(avg >= 255 * 0.5 ? 1 : 0) // 提取指纹
    }
    const arr2d = [] // to 2d arr
    for (let i = 0; i < height; i++) {
        const a = arr.slice(i * width, (i + 1) * width)
        arr2d.push(a)
    }
    return arr2d
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

module.exports = {getPath, mockClick, _parsePostData, _similarImg};

