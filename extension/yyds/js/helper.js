class MyEvent {
    constructor($) {
        this.$ = $
        this.el = document.querySelector('body')
        this.initPoint()
    }

    async emit(params) {
        return new Promise((resolve, reject) => {
            this.$.ajax({
                url: 'yyds/api',
                dataType: 'json',
                data: Object.assign({code: 0, postType: ''}, params),
                headers: {'custom-info': 'yyds'},
                timeout: 5000,
                type: 'post',
                success(res) {
                    console.log('请求成功', res);
                    if (res.code === 0) resolve(res.data)
                },
                error(err) {
                    console.log('请求失败', err);
                    reject(err)
                }
            });
        })
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
        this.hidden = true
        this.initCanvas()
    }

    initCanvas() {
        const K = 4
        let canvasEle = document.createElement('canvas')
        canvasEle.id = 'yyds-canvas'
        canvasEle.style.display = 'none'
        canvasEle.style.zIndex = '-100'
        canvasEle.style.opacity = '0'
        canvasEle.width = this.viewWidth / K
        canvasEle.height = this.viewHeight / K
        document.body.appendChild(canvasEle)
        this.canvasEle = canvasEle
    }

    toggleCanvasToPage() { // 将canvas显示/隐藏
       if (this.canvasEle) {
           if (this.hidden) {
               this.canvasEle.style.display = 'block'
               this.canvasEle.style.zIndex = '100'
               this.canvasEle.style.opacity = '1'
               this.canvasEle.style.position = 'fixed'
               this.canvasEle.style.top = '0'
               this.canvasEle.style.left = '0'
               this.hidden = false
           }else{
               this.canvasEle.style.display = 'none'
               this.canvasEle.style.zIndex = '-100'
               this.canvasEle.style.opacity = '0'
           }
       }else{
           this.initCanvas()
       }
    }

    createNewCanvas() { // 画一幅原始尺寸的画
        let newCanvas = document.getElementById('yyds-origin-canvas')
        if (!newCanvas) {
            newCanvas = document.createElement('canvas')
            newCanvas.id = 'yyds-origin-canvas'
            newCanvas.style.zIndex = '100'
            newCanvas.style.position = 'fixed'
            newCanvas.style.top = '0'
            newCanvas.style.left = '0'
            newCanvas.width = this.viewWidth
            newCanvas.height = this.viewHeight
            newCanvas.style.display = 'block'
            document.body.appendChild(newCanvas)
        }
        newCanvas.style.display = newCanvas.style.display === 'none' ? 'block' : 'none'
        const ctx = newCanvas.getContext('2d')
        ctx.drawImage(this.videoEle, 0, 0, newCanvas.width, newCanvas.height)
    }

    fresh() {
        if (!this.videoEle) {
            this.videoEle = document.querySelector(this.selector ? this.selector : 'video')
            return
        }

        if (!this.canvasEle) {
            this.initCanvas()
        }
    }

    drawVideoImg() {
        // draw video into canvas
        if (this.videoEle && this.canvasEle) {
            const ctx = this.canvasEle.getContext('2d')
            ctx.imageSmoothingEnabled = false // 锐化
            ctx.drawImage(this.videoEle, 0, 0, this.canvasEle.width, this.canvasEle.height)
        }
    }
}
