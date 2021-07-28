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
const {reactive} = Vue

const App = {
    setup(props) {
        const retObj = {};
        const baseInfo = reactive({
            counter: 0,
            activePageTab: 'setting',
            tabs: [
                {label: 'Game', name: 'game'}, {label: 'Setting', name: 'setting'}
            ],
            activeGameTab: 'yuhun',
            gameTabs: [
                {label: '御魂', name: 'yuhun'}, {label: '御灵', name: 'yuling'}
            ],
            settingCards: [
                {label: '点击监听', name: 'listenClick'}, {label: '抓取视频', name: 'drawVideo'}
            ]
        });
        Object.assign(retObj, {baseInfo});

        const onPageTabClick = () => {
            const tabName = baseInfo.activePageTab

        }
        const onGameTabClick = ()=>{
            const tabName = baseInfo.activeGameTab

        }
        Object.assign(retObj, {onPageTabClick,onGameTabClick});

        return retObj
    },
}
const app = Vue.createApp(App);
app.use(ElementPlus);
app.mount("#app");

