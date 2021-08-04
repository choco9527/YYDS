const {computed, reactive} = Vue
const bg = chrome.extension ? chrome.extension.getBackgroundPage() : {$playingList: []}

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
            settingCards: [
                {label: '点击监听', name: 'listenClick', cmd: 'listenClick'},
                {label: '抓取视频', name: 'drawVideo', cmd: 'drawVideo'},
                {label: '测试视频', name: 'videoTest', cmd: 'videoTest'},
                {label: '测试', name: 'test', cmd: 'test'}
            ]
        });
        Object.assign(retObj, {baseInfo});

        let playingList = reactive(bg.$playingList)
        const gameTabs = computed(() => [
            {label: '御魂', name: 'yuhun', cmd: 'yuhun', data: {status: 0}},
            {label: '痴', name: 'chi', cmd: 'chi', data: {status: 0}},
            {label: '御灵', name: 'yuling', cmd: 'yuling', data: {status: 0}}
        ].map(tab => {
            tab.data.status = playingList.map(item => item.gameType).includes(tab.name) ? 1 : 0
            return tab
        }))

        Object.assign(retObj, {gameTabs});

        const onPageTabClick = () => {
            const tabName = baseInfo.activePageTab
        }
        const onGameTabClick = () => {
            const tabName = baseInfo.activeGameTab
        }
        const onGameClick = ({cmd, label, data}) => {
            $sendMessageToContentScript({cmd, type: 'game'}, res => {
                if ($gameStatusArr.includes(res.cmd)) {
                    $notify(label + '操作', res.msg)
                    if (res.cmd === 'start') {
                        bg.$playingList.push({gameType: cmd})
                        playingList.push({gameType: cmd})
                    }
                    if (res.cmd === 'stop') {
                        for (let i = 0; i < bg.$playingList.length; i++) {
                            if (bg.$playingList[i].gameType === cmd) {
                                bg.$playingList.splice(i, 1)
                                playingList.splice(i, 1)
                            }
                        }
                    }
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
app.use(vant);
app.mount("#app");

