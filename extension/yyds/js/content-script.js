;$(document).ready(function () {
    (function listenPage() { // 接受popup消息
        chrome.runtime.onMessage.addListener((res, sender, sendResponse) => {
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
                    console.log('listening video 2 canvas')
                    const $canvas = new HandleCanvas()
                    setInterval(() => {
                        $canvas.fresh()
                        $canvas.drawVideoImg()
                    }, 500)
                } else if (cmd === 'tab3') {
                    const $e = new MyEvent($)
                    console.log('开始事件通讯');
                    $e.emit({msg: 'close'})
                }
            }
            sendResponse('ok')
        });
    })();

    (function drawVideoAuto() { // draw video 2 canvas
        console.log('listening video 2 canvas auto')
        const $canvas = new HandleCanvas()
        setInterval(() => {
            $canvas.fresh()
            $canvas.drawVideoImg()
        }, 200)
    })();

    (function clearPage() { // 清理页面（关闭一些弹窗）
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
    })();
})
