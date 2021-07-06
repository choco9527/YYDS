// 通过postMessage调用content-script
function invokeContentScript(code)
{
    window.postMessage({cmd: 'invoke', code: code}, '*');
}
// 发送普通消息到content-script
function sendMessageToContentScriptByPostMessage(data={yydsCode : 0})
{
    window.postMessage({cmd: 'message', data: data}, '*');
}
