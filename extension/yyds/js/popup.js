$(document).ready(function () {
    $('.tab1').click((e) => {
        // $notify('标题', '监听点击')
        $sendMessageToContentScript({cmd: 'tab1', value: '你好，我是popup！'}, (response) => {
            console.log('来自content的回复：' + response);
        });
    })
    $('.tab2').click((e) => {
        // $notify('标题', '监听视频')
        $sendMessageToContentScript({cmd: 'tab2', value: '你好，我是popup！'}, (response) => {
            console.log('来自content的回复：' + response);
        });
    })
})
