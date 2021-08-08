const pageMap = {
    'videoTest': [
        {
            name: '测试页',
            path: 'img/test/smallyoumi.png', // 比对的图片路径
            position: {x1: 300, y1: 195, x2: 670, y2: 250}, // 比对图片区域（无则比对整张图）
            clickMap: [{x: 2, y: 2}], // 安全点击位置
            // dragMap: [{x1: 10, y1: 100, x2: 250, y2: 200, duration: 200}, {x1: 20, y1: 200, x2: 350, y2: 100, duration: 1000}], // 拖拽行为
            clickTimes: 1, // 点击次数
            simi: 0.8, // 相似度阈值
            r: 30, // 点击半径
            img: {data: null} // 图片data缓存
        },
    ],
    'yuhun': [
        {
            name: '御魂选择页',
            path: 'img/yys/pages/yuhun/yuhun_out.png',
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
            simi: 0.5,
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
            position: {x1: 0, y1: 300, x2: 960, y2: 540},
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
            name: '探索->业原火',
            path: 'img/yys/pages/global/tansuo.png',
            clickMap: [{x: 155, y: 500}],
            position: {x1: 50, y1: 470, x2: 760, y2: 540},
            clickTimes: 1,
            simi: 0.45,
            r: 40,
            img: {data: null}
        }, {
            name: '业原火选择',
            path: 'img/yys/pages/global/yuhun_out.png',
            clickMap: [{x: 420, y: 280}, {x: 410, y: 180}, {x: 430, y: 380}],
            clickTimes: 1,
            simi: 0.6,
            r: 50,
            img: {data: null}
        }, {
            name: '贪->痴',
            path: 'img/yys/pages/yeyuanhuo/tan.png',
            clickMap: [{x: 250, y: 365}],
            position: {x1: 0, y1: 0, x2: 470, y2: 480},
            clickTimes: 1,
            simi: 0.9,
            r: 30,
            img: {data: null}
        }, {
            name: '痴->战斗',
            path: 'img/yys/pages/yeyuanhuo/chi.png',
            clickMap: [{x: 870, y: 480}],
            position: {x1: 0, y1: 0, x2: 470, y2: 480},
            clickTimes: 2,
            simi: 0.6,
            r: 50,
            img: {data: null}
        }]
}

const globalMap = { // 公用图
    'fighting': [{
        name: '战斗中',
        path: 'img/yys/pages/global/fighting.png',
        position: {x1: 0, y1: 530, x2: 150, y2: 670},
        clickTimes: 1,
        simi: 0.2,
        r: 30,
        img: {data: null}
    },{
        name: '战斗结束',
        path: 'img/yys/pages/global/finish.png',
        clickMap: [{x: 700, y: 400}, {x: 430, y: 470}, {x: 500, y: 380}, {x: 650, y: 430}, {x: 140, y: 380}],
        position: {x1: 400, y1: 300, x2: 570, y2: 460},
        clickTimes: 1,
        simi: 0.4,
        r: 20,
        img: {data: null}
    }, {
        name: '战斗失败',
        path: 'img/yys/pages/global/fail.png',
        clickMap: [{x: 135, y: 385}, {x: 825, y: 400}, {x: 780, y: 175}, {x: 120, y: 170}, {x: 400, y: 160}],
        position: {x1: 240, y1: 80, x2: 740, y2: 200},
        clickTimes: 1,
        simi: 0.45,
        r: 20,
        img: {data: null}
    }],
    'tingyuan': [{
        name: '庭院（未展开）',
        path: 'img/yys/pages/global/tingyuan_close.png',
        position: {x1: 880, y1: 443, x2: 960, y2: 540},
        clickMap: [{x: 915, y: 485},],
        clickTimes: 1,
        simi: 0.5,
        r: 10,
        img: {data: null}
    }, {
        name: '庭院进探索（展开）',
        path: 'img/yys/pages/global/tingyuan_open.png',
        position: {x1: 80, y1: 450, x2: 880, y2: 510},
        clickMap: [{x: 510, y: 100}, {x: 510, y: 110}],
        clickTimes: 1,
        simi: 0.5,
        r: 10,
        img: {data: null}
    }]
}

pageMap['yuhun'].push(...globalMap['fighting'])
pageMap['yuling'].push(...globalMap['fighting'])
pageMap['chi'].push(...globalMap['fighting'], ...globalMap['tingyuan'])

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
