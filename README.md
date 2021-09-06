yyds
==========
1. 安装nodejs https://nodejs.org/zh-cn/
2. npm -i 安装项目依赖
3. .env文件中配置电脑中Chrome浏览器地址（CHROME_PATH = "C:\Program Files\Google\Chrome\Application\chrome.exe"）
4. .env文件可配置手机号，会在打开窗口后自动填写（PHONE = 13843838438）

##Chorme拓展
### contentjs层
1. 可控制注入页面的js信息，通过`MyEvent`类注入请求方法，通过`HandleCanvas`类注入canvas方法；
2. 通过`chrome.runtime.onConnect.addListener`方法监听popup层事件
3. 通过ajax发送请求

### popup层
1. 通过`port.postMessage`接受contentjs返回信息
2. 通过chromeApi `chrome.notifications` 向系统发送通知
3. 通过`chrome.extension.getBackgroundPage()`获取background层变量


### background层
1. 储存变量，同步不同页面数据，保证popup数据一致性


##[puppeteer](https://github.com/puppeteer/puppeteer/ "puppeteer")
1. 因为event事件属性 `isTrusted` 属性无法改变
2. 可灵活操作所有事件，包括滚轮键盘鼠标等事件
2. 基于nodejs可灵活操作本地图片，浏览器不行
3. 将性能分散，减少浏览器压力

##[图像处理](https://segmentfault.com/a/1190000021236326 "图像处理")
1. contentjs中 `drawVideoImg` 读取页面视频元素，并缩放至1/4大小
2. 主逻辑中，`_getVideoData`方法获取像素数据
3. 主逻辑中，`_getImageData`方法获取本地图片信息
4. 主逻辑中，`_similarImg`计算相似度

##防封处理
1. 区域-○内随机点击 circleArea
2. 时长- 按下到松开时长 delay
3. 次数- 一次点击操作的次数 loopClickTimes
4. 频率- 点击触发之间间隔 frequency
5. 一轮点击时长 = 次数：loopClickTimes × (频率：frequency + 点击延时：delay)

##数据处理
1. 数据储存在mapjs中