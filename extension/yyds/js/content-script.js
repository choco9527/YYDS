$(document).ready(function () {
    chrome.runtime.onMessage.addListener((res, sender, sendResponse) => { // 接受消息
        if (res.code === 'yyds') {
            const {cmd} = res
            if (cmd === 'tab1') {
                console.log('开始监听点击')
                const $e = new MyEvent($)
                $('body').click(e => {
                    console.log(e);
                    $e.shrinkPoint(e.clientX, e.clientY)
                })
            } else if (cmd === 'tab2') {
                console.log('开始监听视频')
                const $canvas = new HandleCanvas()
                setInterval(() => {
                    $canvas.freshCanvas()
                    $canvas.drawVideoImg()
                }, 1000)
            }
        }
        sendResponse('ok')
    })
})
