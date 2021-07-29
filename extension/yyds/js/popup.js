const {ref, reactive} = Vue
const {ElMessage: $msg} = ElementPlus
const bg = chrome.extension.getBackgroundPage();

const App = {
    setup(props) {
        const retObj = {};
        const baseInfo = reactive({
            counter: 0,
            activePageTab: 'game',
            tabs: [
                {label: 'Game', name: 'game'}, {label: 'Setting', name: 'setting'}
            ],
            activeGameTab: 'yuhun',
            gameTabs: [
                {label: '御魂', name: 'yuhun', cmd: 'yuhun', data: {status: 0}},
                {label: '痴', name: 'chi', cmd: 'chi', data: {status: 0}},
                {label: '御灵', name: 'yuling', cmd: 'yuling', data: {status: 0}}
            ],
            settingCards: [
                {label: '点击监听', name: 'listenClick', cmd: 'listenClick'},
                {label: '抓取视频', name: 'drawVideo', cmd: 'drawVideo'}
            ]
        });
        Object.assign(retObj, {baseInfo});

        const onPageTabClick = () => {
            const tabName = baseInfo.activePageTab
        }
        const onGameTabClick = () => {
            const tabName = baseInfo.activeGameTab
        }
        const onGameClick = ({cmd, label, data}) => {
            $sendMessageToContentScript({cmd, type: 'game'}, res => {
                if ($gameStatusArr.includes(res.code)) {
                    // data.status = res.code === 'start' ? 1 : res.code ? 0 : -1
                    console.log(bg.$playingList);
                    $notify(label + '操作', res.msg)
                }
            });
        }
        const onSettingClick = (cmd, label) => {
            $sendMessageToContentScript({cmd, type: 'setting'}, res => {
                if (res === 'ok') $notify('setting操作', label)
            });
        }
        Object.assign(retObj, {onPageTabClick, onGameTabClick, onGameClick, onSettingClick});
        return retObj
    },
}
const app = Vue.createApp(App);
app.use(ElementPlus);
app.mount("#app");

