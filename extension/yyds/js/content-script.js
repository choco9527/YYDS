﻿;$(document).ready(function () {
    const $e = new MyEvent($);
    const $canvas = new HandleCanvas();
    Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
    });
    let time = 0;
    (function listenPage() { // 接受popup消息
        chrome.runtime.onMessage.addListener((res, sender, sendResponse) => {
            if (res.code === 'yyds') {
                const {cmd} = res
                if (cmd === 'listenClick') {
                    console.log('开始监听点击')
                    $('body').click(e => {
                        const now = Date.now()
                        console.log('click_body', now - time);
                        time = now
                        $e.shrinkPoint(e.clientX, e.clientY)
                    })
                } else if (cmd === 'drawVideo') {
                    console.log('draw video 2 canvas')
                    $canvas.createNewCanvas()
                }else if (cmd === 'tab4') {
                    console.log('开始御魂');
                    $e.emit({msg: 'yuhun', type: 'play'})
                }
            }
            sendResponse('ok')
        });
    })();

    (function drawVideoAuto() { // draw video 2 canvas auto
        console.log('listening video 2 canvas auto')
        setInterval(() => {
            $canvas.fresh()
            $canvas.drawVideoImg()
        }, 600)
    })();

    (function clearPage() { // 清理页面（关闭一些弹窗）
        const timeout = 1000, closeSlide = setInterval(() => {
            $('.slide-close').trigger('click')
            $('h2.f14').each(function (i, ele) {
                if (ele.innerText === '阴阳师（ios+安卓）') {
                    const playEl = $(this).parent().next()
                    playEl.trigger('click')
                    $e.emit({type: 'pageHandle', msg: 'inputPhone'})
                    clearInterval(closeSlide)
                    return false
                }
            });
        }, timeout)
        setTimeout(_ => clearInterval(closeSlide), 10 * timeout)
    })();
})
