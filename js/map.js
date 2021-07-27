const pageMap = {
    'yuhun': [
        {
            name: '御魂选择页',
            path: 'img/yys/pages/yuhun/yuhun_out.png',
            clickMap: [{x: 200, y: 320}],
            clickTimes: 1,
            simi: 0.6,
            r: 30
        },
        {
            name: '挑战选择页（单刷）',
            path: 'img/yys/pages/yuhun/select.png',
            clickMap: [{x: 870, y: 485}],
            clickTimes: 3,
            simi: 0.7,
            r: 20
        },
        {
            name: '御魂组队页',
            path: 'img/yys/pages/yuhun/zudui.png',
            clickMap: [{x: 200, y: 320}],
            clickTimes: 1,
            simi: 0.7,
            r: 12
        },
        {
            name: '御魂结束页',
            path: 'img/yys/pages/yuhun/finish.png',
            clickMap: [{x: 700, y: 400}],
            clickTimes: 5,
            simi: 0.45,
            r: 50
        }
    ]
}

module.exports = {pageMap}
