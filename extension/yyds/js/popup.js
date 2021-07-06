$(document).ready(function () {
    console.log(chrome);
    $('.tab1').click(()=>{
        // $notify('标题','开始御魂')
        $sendMessageToContentScript({cmd:'tab1', value:'你好，我是popup！'}, (response)=>
        {
            console.log('来自content的回复：'+response);
        });
    })
})
