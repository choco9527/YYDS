const pageMap = {
    'videoTest': [
        {
            name: '测试页',
            path: 'img/test/testyoumi.png', // 比对的图片路径
            position: {x1: 290, y1: 176, x2: 680, y2: 300}, // 比对图片区域（无则比对整张图）
            clickMap: [{x: 2, y: 2}], // 安全点击位置
            clickTimes: 1, // 点击次数
            simi: 0.8, // 相似度阈值
            r: 30, // 点击半径
            img: {data: null} // 图片data缓存
        },
        {
            name: '测试页2',
            path: 'img/test/testyoumi.png', // 比对的图片路径
            position: {x1: 290, y1: 176, x2: 680, y2: 300}, // 比对图片区域（无则比对整张图）
            clickMap: [{x: 2, y: 2}], // 安全点击位置
            clickTimes: 1, // 点击次数
            simi: 0.8, // 相似度阈值
            r: 30, // 点击半径
            img: {data: null} // 图片data缓存
        }
    ],
    'yuhun': [
        {
            name: '御魂选择页',
            path: 'img/yys/pages/yuhun/yuhun_out.png',
            // position: {x1: 0, y1: 62, x2: 240, y2: 135},
            clickMap: [{x: 200, y: 320}],
            clickTimes: 1,
            simi: 0.6,
            r: 30,
            img: {data: null}
        },
        {
            name: '御魂11选择页（单刷）',
            path: 'img/yys/pages/yuhun/yuhun11.png',
            clickMap: [{x: 870, y: 485}],
            clickTimes: 2,
            simi: 0.6,
            r: 20,
            img: {data: null}
        },
        {
            name: '御魂组队页',
            path: 'img/yys/pages/yuhun/zudui.png',
            clickMap: [{x: 200, y: 320}],
            clickTimes: 1,
            simi: 0.7,
            r: 12,
            img: {data: null}
        },
        {
            name: '御魂结束页',
            path: 'img/yys/pages/yuhun/finish.png',
            // position: {x1: 0, y1: 0, x2: 200, y2: 300},
            clickMap: [{x: 700, y: 400}, {x: 430, y: 470}, {x: 500, y: 380}, {x: 650, y: 430}, {x: 140, y: 380}],
            clickTimes: 3,
            simi: 0.45,
            r: 50,
            img: {data: null}
        }
    ],
    'yuling': [
        {
            name: '御灵选择页',
            path: 'img/yys/pages/yuhun/yuhun_out.png',
            clickMap: [{x: 200, y: 320}],
            clickTimes: 1,
            simi: 0.6,
            r: 30,
            img: {data: null}
        }],
    'chi': [
        {
            name: '痴选择页',
            path: 'img/yys/pages/yuhun/yuhun_out.png',
            clickMap: [{x: 200, y: 320}],
            clickTimes: 1,
            simi: 0.6,
            r: 30,
            img: {data: null}
        }, {
            name: '痴开始页',
            path: 'img/yys/pages/chi/chi_start.png',
            clickMap: [{x: 870, y: 480}, {x: 870, y: 460}, {x: 880, y: 500}],
            clickTimes: 2,
            simi: 0.6,
            r: 10,
            img: {data: null}
        }, {
            name: '痴结束页',
            path: 'img/yys/pages/chi/finish.png',
            clickMap: [{x: 700, y: 400}, {x: 430, y: 470}, {x: 500, y: 380}, {x: 650, y: 430}, {x: 140, y: 380}],
            clickTimes: 1,
            simi: 0.7,
            r: 20,
            img: {data: null}
        }, {
            name: '痴失败页',
            path: 'img/yys/pages/chi/fail.png',
            clickMap: [{x: 135, y: 385}, {x: 825, y: 400}, {x: 780, y: 175}, {x: 120, y: 170}, {x: 400, y: 160}],
            clickTimes: 1,
            simi: 0.7,
            r: 20,
            img: {data: null}
        }]
}

const globalMap = { // 公用图

}

function deepFreeze(obj) {
    const propNames = Object.getOwnPropertyNames(obj);
    propNames.forEach(function (name) {
        const prop = obj[name];
        if (name === 'img') return // dont freeze prop 'img'
        if (typeof prop == 'object' && prop !== null)
            deepFreeze(prop);
    });
    return Object.freeze(obj);
}

module.exports = {pageMap: deepFreeze(pageMap)}
