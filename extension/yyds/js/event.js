class MyEvent {
    constructor() {
        this.el = document.querySelector('body')
    }

    patchEvent(X = 0, Y = 0) {
        const ev = document.createEvent('HTMLEvents');
        ev.clientX = X
        ev.clientY = Y
        ev.initEvent('click', false, true);
        const res = this.el.dispatchEvent(ev)
        console.log(res);
    }
}
