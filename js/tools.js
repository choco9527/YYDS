function getPath(path) {
    return __dirname + '/../' + path
}

function randomNumber(min = 0, max = 0, Int = true) // random Int / Float
{
    return Int ? Math.floor(Math.random() * (max - min + 1) + min) :
        Math.random() * (max - min) + min
}

function getCircleArea(x = 0, y = 0, r = 10) { // get area by xy for circle
    const cX = randomNumber(-r, r) // x position
    const maxY = Math.sqrt(r * r - cX * cX) //  -maxY —— +maxY
    const cY = randomNumber(-maxY, maxY)
    return {cX, cY}
}

async function mockClick({page = null, x = 0, y = 0}) { // a new click loop
    console.log('a new click loop')
    console.time()

    const click = async () => { // just once click
        const {cX, cY} = getCircleArea(x, y)
        console.log('click:', x + cX, y + cY)
        await page.mouse.click(x + cX, y + cY, {delay: randomNumber(0,10)})
    }

    const loopClick = async (loopClickTimes=1) => {
        // create loopClick
        if (loopClickTimes < 1 ) return
        let times = randomNumber(1,loopClickTimes), timing = 0
        const dispatchTimeClick = async (x = 0, y = 0,frequency = randomNumber(222, 666)) => { // create a frequency click
            return new Promise(resolve => {
                const t = setTimeout(async () => {
                    await click()
                    resolve(t)
                }, frequency)
            })
        }
        while (timing < times) {
            timing ++
            await dispatchTimeClick(x,y)
        }
        console.log(timing);
    }
    await loopClick(3)
    console.timeEnd() // 一轮点击时长 = 次数：loopClickTimes × (频率：frequency + 点击延时：delay)
    return Promise.resolve('success')
}


module.exports = {getPath, mockClick};

