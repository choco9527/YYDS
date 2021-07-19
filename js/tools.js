function getPath(path) {
    return __dirname + '/../' + path
}

function randomNumber(min = 0, max = 0, Int = true) // 随机数 (非整数/整数)
{
    return Int ? Math.floor(Math.random() * (max - min + 1) + min) :
        Math.random() * (max - min) + min
}

function getCircleArea(x = 0, y = 0, r = 10) { // 获取xy为圆心的圆形点击范围
    const cX = randomNumber(-r, r) // x位置
    const maxY = Math.sqrt(r * r - cX * cX) // y最大距离 -maxY —— +maxY
    const cY = randomNumber(-maxY, maxY)
    return {cX, cY}
}

async function mockClick({page = null, x = 0, y = 0}) { // 产生一轮模拟点击
    const {cX, cY} = getCircleArea(x, y)
    console.log(x + cX, y + cY)
    const delay = 20 // 按下等待时间

    const click = async ()=>{
        await page.mouse.click(x + cX, y + cY,{delay})
    }

    await click()

}


module.exports = {getPath, mockClick};

