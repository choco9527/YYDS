;$(document).ready(function () {
    const $e = new MyEvent($);
    const $canvas = new HandleCanvas();

    let time = 0;
    let dragging = false
    ;(function listenPage() { // 接受popup消息
        chrome.runtime.onConnect.addListener(async (port) => {
            if (port.name !== 'yyds-popup-connect') return
            port.onMessage.addListener(async res => {
                const {cmd, code, type} = res
                if (code !== 'yyds') return port.postMessage('fail')
                if (type === 'setting') {
                    port.postMessage('ok')
                    let resData
                    switch (cmd) {
                        case 'listenClick':
                            console.log('开始监听点击')
                            const body = $('body')
                            body.mousedown(e => dragging = true)
                                .mousemove(e => dragging && $e.shrinkPoint(e.clientX, e.clientY))
                                .mouseup(e => {
                                    $e.shrinkPoint(e.clientX, e.clientY)
                                    dragging = false
                                })
                            break
                        case 'drawVideo':
                            console.log('draw video 2 canvas')
                            $canvas.toggleCanvasToPage()
                            break
                        case 'videoTest':
                            resData = await $e.emit({cmd, postType: 'game'})
                            if ($gameStatusArr.includes(resData.cmd)) port.postMessage(resData)
                            break
                        case 'test':
                            resData = await $e.emit({cmd, postType: 'pageHandle'})
                            if ($gameStatusArr.includes(resData.cmd)) port.postMessage(resData)
                            break
                    }
                } else if (type === 'game') {
                    const resData = await $e.emit({cmd, postType: 'game'})
                    if ($gameStatusArr.includes(resData.cmd)) port.postMessage(resData)
                }
            });
        });
    })()

    // draw video 2 canvas auto
    ;(function drawVideoAuto() {
        console.log('listening video 2 canvas auto')
        setInterval(() => {
            $canvas.fresh()
            $canvas.drawVideoImg()
        }, 600)
    })()

    // 清理页面（关闭一些弹窗）
    ;(function clearPage() {
        const timeout = 1000, closeSlide = setInterval(() => {
            $('.slide-close').trigger('click')
            $('h2.f14').each(function (i, ele) {
                if (ele.innerText === '阴阳师(ios服)') {
                    const playEl = $(this).parent().next()
                    playEl.trigger('click')
                    $e.emit({postType: 'pageHandle', cmd: 'inputPhone'})
                    clearInterval(closeSlide)
                    return false
                }
            });
        }, timeout)
        setTimeout(_ => clearInterval(closeSlide), 10 * timeout)
    })();

})
