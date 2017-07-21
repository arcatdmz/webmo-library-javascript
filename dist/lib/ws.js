"use strict";
const events_1 = require("events");
const websocket = require("websocket");
// Promise is implemented in Node.js starting from v0.12.x
const WebSocket = websocket.w3cwebsocket;
class Webmo {
    constructor(host) {
        host = host || 'webmo.local';
        this.host = host;
        this.stepDegree = 1.8;
        this.onmessage = null;
        this._ws = new WebSocket('ws://' + host + ':8080/');
        this._ev = new events_1.EventEmitter();
        this._ws.onopen = (e) => {
            if (typeof (this.onopen) === 'function') {
                this.onopen(e);
            }
            this._ev.emit('open');
        };
        this._ws.onmessage = (e) => {
            var json = JSON.parse(e.data);
            if (typeof (this.onmessage) === 'function') {
                this.onmessage(json);
            }
            this._ev.emit(json.type, json);
        };
        this._ws.onclose = (e) => {
            if (typeof (this.onclose) === 'function') {
                this.onclose();
            }
        };
        this._ws.onerror = (e) => {
            if (typeof (this.onerror) === 'function') {
                this.onerror();
            }
            console.log('error!', e);
        };
    }
    close() {
        this._ws.close();
    }
    getStatus() {
        var packed = JSON.stringify({ type: 'status' });
        this._ws.send(packed);
    }
    //
    // rotate
    //
    rotate(speed, option) {
        if (typeof speed === 'object') {
            option = speed;
            speed = undefined;
        }
        var packed = JSON.stringify({ type: 'rotate', speed: speed });
        this._ws.send(packed);
    }
    rotateTo(target, absRange, speed) {
        var packed = JSON.stringify({ type: 'rotateTo', target: target, absRange: absRange, speed: speed });
        this._ws.send(packed);
        // XXX: reject
        return new Promise((resolve, reject) => {
            this._ev.once('notice', function (data) {
                if (data.msg === 'done' && data.func === 'rotateTo') {
                    resolve(data);
                }
            });
        });
    }
    rotateBy(diff, speed) {
        var packed = JSON.stringify({ type: 'rotateBy', diff: diff, speed: speed });
        this._ws.send(packed);
        // XXX: reject
        return new Promise((resolve, reject) => {
            this._ev.once('notice', function (data) {
                if (data.msg === 'done' && data.func === 'rotateBy') {
                    resolve(data);
                }
            });
        });
    }
    rotateToHome() {
        console.log('not impl');
    }
    //
    // Stop
    //
    stopHard() {
        return this.stop(true, false);
    }
    stopSoft() {
        return this.stop(false, false);
    }
    stop(smooth, lock) {
        var packed = JSON.stringify({ type: 'stop', smooth: smooth, lock: lock });
        this._ws.send(packed);
        // XXX: reject
        return new Promise((resolve, reject) => {
            this._ev.once('notice', function (data) {
                if (data.msg === 'done' && data.func === 'stop') {
                    resolve(data);
                }
            });
        });
    }
    //
    // lock
    //
    lock(smooth) {
        var packed = JSON.stringify({ type: 'lock', smooth: smooth });
        this._ws.send(packed);
    }
    unlock() {
        var packed = JSON.stringify({ type: 'unlock' });
        this._ws.send(packed);
    }
    //
    // goodies
    //
    tick(timeMs) {
        var packed = JSON.stringify({ type: 'tick', timeMs: timeMs });
        this._ws.send(packed);
    }
    //
    // Home
    //
    resetHome() {
        console.log('not impl');
    }
    // helper function
    degreeToStep(degree) {
        return degree / this.stepDegree;
    }
    stepToDegree(step) {
        return step * this.stepDegree / 128; // XXX: microstep must be supplied
    }
    getSpeedPerSecondByStep(step) {
        return Math.pow(2, 28) * step / Math.pow(10, 9) * 250;
    }
    getSpeedPerSecondByDegree(degree) {
        return this.getSpeedPerSecondByStep(this.degreeToStep(degree));
    }
}
exports.Webmo = Webmo;
//# sourceMappingURL=ws.js.map