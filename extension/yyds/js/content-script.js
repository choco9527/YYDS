$(document).ready(function () {
    // 监听popup事件
    const $e = new MyEvent()

    chrome.runtime.onMessage.addListener((res, sender, sendResponse) => { // 接受消息
        if (res.code === 'yyds') {

            // console.log(res);
            $e.patchEvent(100, 100)

            $('body').click(e => {
                console.log(e);
            })

            sendResponse('get')
        }
    })


})
