// 处理消息内容
window.$notify = (title = '', message = '') => {
    chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'img/icon.png',
        title,
        message
    })
}

window.$sendMessageToContentScript = (message, cb) => {
    Object.assign(message, {code: 'yyds'})
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const port = chrome.tabs.connect(tabs[0].id, {name: 'yyds-popup-connect'});
            port.postMessage(message);
            port.onMessage.addListener(data => cb(data))
        }
    )
}

