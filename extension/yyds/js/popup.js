// $(document).ready(function () {
//     $('.tab1').click((e) => {
//         $sendMessageToContentScript({cmd: 'tab1'}, (response) => console.log(response));
//     })
//     $('.tab2').click((e) => {
//         // $notify('标题', '监听视频')
//         $sendMessageToContentScript({cmd: 'tab2'}, (response) => console.log(response));
//     })
//     $('.tab3').click((e) => {
//         $sendMessageToContentScript({cmd: 'tab3'}, (response) => console.log(response));
//     })
//     $('.tab4').click((e) => {
//         $sendMessageToContentScript({cmd: 'tab4'}, (response) => console.log(response));
//     })
// })

const App = {
    data() {
        return {
            counter: 0
        }
    },
    mounted() {
        setInterval(() => {
            this.counter++
        }, 1000)
    }
}




const app = Vue.createApp(App);
app.use(ElementPlus);
app.mount("#app");

