$(document).ready(function () {
    $('.tab1').click((e) => {
        $sendMessageToContentScript({cmd: 'tab1'}, (response) => console.log(response));
    })
    $('.tab2').click((e) => {
        // $notify('标题', '监听视频')
        $sendMessageToContentScript({cmd: 'tab2'}, (response) => console.log(response));
    })
    $('.tab3').click((e) => {
        $sendMessageToContentScript({cmd: 'tab3'}, (response) => console.log(response));
    })
})
