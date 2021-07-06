$(document).ready(function () {
    // 处理消息内容
    window.$notify = (title = '', message = '') => {
        chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: 'img/icon.png',
            title,
            message
        })
    }
    window.$sendMessageToContentScript = (message, callback) => {
        Object.assign(message, {code: 'yyds'})
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) =>
            chrome.tabs.sendMessage(tabs[0].id, message, (response=null) => (callback && response) && callback(response))
        )
    }
})

