$(document).ready(function () {
    const timeout = 1000, closeSlide = setInterval(() => {
        $('.slide-close').trigger('click')
        $('h2.f14').each(function (i, ele) {
            if (ele.innerText === '阴阳师（ios+安卓）') {
                const playEl = $(this).parent().next()
                playEl.trigger('click')
                clearInterval(closeSlide)
                return false
            }
        });
    }, timeout)
    setTimeout(_ => clearInterval(closeSlide), 10 * timeout)

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
                }, 0)
            }
        }
        sendResponse('ok')
    })
})
