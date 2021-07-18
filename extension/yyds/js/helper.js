class MyEvent {
    constructor($) {
        this.$ = $
        this.el = document.querySelector('body')
        this.initPoint()
    }

    patchEvent(X = 0, Y = 0) {
        const ev = document.createEvent('HTMLEvents');
        ev.clientX = X
        ev.clientY = Y
        ev.initEvent('click', false, true);
        const res = this.el.dispatchEvent(ev)
        console.log(res);
    }

    initPoint() { // 初始化小圆点
        this.showPoint = this.$('<p class="show-point"/>')
        const bodyEl = this.$('body')
        this.showPoint.css({
            margin: 0,
            padding: 0,
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'red',
            position: 'fixed',
            opacity: 0,
            transition: 'opacity 0.2s ease-in-out'
        })
        bodyEl.append(this.showPoint)
    }

    shrinkPoint(x, y, time = 400) {
        this.showPoint.css({
            opacity: 0.85,
            left: x - 3 + 'px',
            top: y - 3 + 'px'
        })
        setTimeout(() => {
            this.showPoint.css({opacity: 0})
        }, time)
    }
}

class HandleCanvas {
    constructor(videoSelector = '') {
        this.selector = videoSelector
        this.canvasEle = null
        this.videoEle = null
        this.initCanvas()
    }

    initCanvas() { // 初始化canvas
        let canvasEle = document.createElement('canvas')
        let videoEle = document.querySelector(this.selector ? this.selector : 'video')
        canvasEle.id = 'yyds-canvas'
        canvasEle.style.zIndex = 9999
        canvasEle.style.position = 'fixed'
        canvasEle.style.bottom = '0'
        canvasEle.style.left = '0'

        if (videoEle && canvasEle) { // 有可能暂时获取不到video
            this.videoEle = videoEle
            canvasEle.width = videoEle.width || videoEle.clientWidth
            canvasEle.height = videoEle.height || videoEle.clientHeight
            if (videoEle.paused) {
                this.videoEle.muted = true
                this.videoEle.play()
            }
        }

        this.canvasEle = canvasEle
        document.body.appendChild(canvasEle)
        console.log('init success');
    }

    setCanvas() { // 设置canvas 宽高与视频相同
        if (!this.videoEle || !this.canvasEle) return
        let videoWidth = this.videoEle.width || this.videoEle.clientWidth
        let videoHeight = this.videoEle.height || this.videoEle.clientHeight
        if (this.canvasEle.width !== videoWidth || this.canvasEle.height !== videoHeight) {
            this.canvasEle.width = videoWidth
            this.canvasEle.height = videoHeight
        }
    }

    freshCanvas() {
        if (!this.videoEle) {
            this.videoEle = document.querySelector(this.selector ? this.selector : 'video')
            return
        }
        if (this.videoEle.paused) {
            this.videoEle.muted = true
            this.videoEle.play()
        }

        if (!this.canvasEle) {
            this.initCanvas()
            return
        }
        this.setCanvas()
    }

    drawVideoImg() {
        // 获取当前视频画面
        if (this.videoEle && this.canvasEle) {
            console.log('draw')
            this.canvasEle.getContext('2d').drawImage(this.videoEle, 0, 0, this.canvasEle.width, this.canvasEle.height)
        }
    }
}
