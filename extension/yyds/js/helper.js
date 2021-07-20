class MyEvent {
    constructor($) {
        this.$ = $
        this.el = document.querySelector('body')
        this.initPoint()
    }

    emit(params) {
        this.$.ajax({
            url: 'http://localhost:6699', // any port
            dataType: 'json',
            data: Object.assign({code: 0}, params),
            headers: {'custom-info': 'yyds'},
            timeout: 1,
            type: 'post',
            success(res) {
                console.log(res);
            },
            error(err) {
                console.log(err);
            }
        });
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
            transition: 'opacity 0.2s ease-in-out',
            zIndex: 20217777
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
        this.viewWidth = 960
        this.viewHeight = 540
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
            canvasEle.width = this.viewWidth
            canvasEle.height = this.viewHeight
            this.videoEle = videoEle
            this.freshVideo()
        }

        this.canvasEle = canvasEle
        document.body.appendChild(canvasEle)
    }

    setCanvas() { // set canvas width height
        if (!this.videoEle || !this.canvasEle) return
        let videoWidth = this.videoEle.width || this.videoEle.clientWidth
        let videoHeight = this.videoEle.height || this.videoEle.clientHeight
        if (this.canvasEle.width !== videoWidth || this.canvasEle.height !== videoHeight) {
            this.canvasEle.width = videoWidth
            this.canvasEle.height = videoHeight
        }
    }

    freshVideo() {
        // console.log('fresh');
        // this.videoEle.style.width = this.viewWidth + 'px'
        // this.videoEle.style.height = this.viewHeight + 'px'
        // this.videoEle.width = this.viewWidth
        // this.videoEle.height = this.viewHeight
    }

    freshCanvas() {
        if (!this.videoEle) {
            this.videoEle = document.querySelector(this.selector ? this.selector : 'video')
            return
        }
        if (this.videoEle) {
            this.freshVideo()
        }

        if (!this.canvasEle) {
            this.initCanvas()
            return
        }
    }

    drawVideoImg() {
        // draw video into canvas
        if (this.videoEle && this.canvasEle) {
            const ctx = this.canvasEle.getContext('2d')
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(this.videoEle, 0, 0, this.canvasEle.width, this.canvasEle.height)
            return {width: this.canvasEle.width, height: this.canvasEle.height}
        }
    }
}
