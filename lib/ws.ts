import { EventEmitter } from 'events';
import websocket = require('websocket');
// Promise is implemented in Node.js starting from v0.12.x

const WebSocket = websocket.w3cwebsocket;

class Webmo {
  private host: string;
  private stepDegree: number;
  private onmessage: Function;
  private _ws: any;
  private _ev: EventEmitter;

constructor(host) {
  host = host || 'webmo.local'

  this.host = host
  this.stepDegree = 1.8
  this.onmessage = null
  this._ws = new WebSocket('ws://' + host + ':8080/')
  this._ev = new EventEmitter()

  this._ws.onopen = function (e) {
    if (typeof (this.onopen) === 'function') {
      this.onopen(e)
    }
    this._ev.emit('open')
  }.bind(this)

  this._ws.onmessage = function (e) {
    var json = JSON.parse(e.data)

    if (typeof (this.onmessage) === 'function') {
      this.onmessage(json)
    }
    this._ev.emit(json.type, json)
  }.bind(this)

  this._ws.onclose = function (e) {
    if (typeof (this.onclose) === 'function') {
      this.onclose()
    }

    console.log('closed', e)
  }.bind(this)

  this._ws.onerror = function (e) {
    if (typeof (this.onerror) === 'function') {
      this.onerror()
    }
    console.log('error!', e)
  }.bind(this)
}

public getStatus () {
  var packed = JSON.stringify({type: 'status'})
  this._ws.send(packed)
}

//
// rotate
//
public rotate (speed, option) {
  if (typeof speed === 'object') {
    option = speed
    speed = undefined
  }

  var packed = JSON.stringify({type: 'rotate', speed: speed})
  this._ws.send(packed)
}

public rotateTo (target, absRange, speed) {
  var packed = JSON.stringify({type: 'rotateTo', target: target, absRange: absRange, speed: speed})
  this._ws.send(packed)

  // XXX: reject
  return new Promise(function (resolve, reject) {
    this._ev.on('notice', function (data) {
      if (data.msg === 'done' && data.func === 'rotateTo') {
        resolve(data)
      }
    })
  }.bind(this))
}

public rotateBy (diff, speed) {
  var packed = JSON.stringify({type: 'rotateBy', diff: diff, speed: speed})
  this._ws.send(packed)

  // XXX: reject
  return new Promise(function (resolve, reject) {
    this._ev.on('notice', function (data) {
      if (data.msg === 'done' && data.func === 'rotateBy') {
        resolve(data)
      }
    })
  }.bind(this))
}

public rotateToHome () {
  console.log('not impl')
}

//
// Stop
//
public stopHard () {
  return this.stop(true, false)
}

public stopSoft () {
  return this.stop(false, false)
}

public stop (smooth, lock) {
  var packed = JSON.stringify({type: 'stop', smooth: smooth, lock: lock})
  this._ws.send(packed)

  // XXX: reject
  return new Promise(function (resolve, reject) {
    this._ev.on('notice', function (data) {
      if (data.msg === 'done' && data.func === 'stop') {
        resolve(data)
      }
    })
  }.bind(this))
}
//
// lock
//
public lock (smooth) {
  var packed = JSON.stringify({type: 'lock', smooth: smooth})
  this._ws.send(packed)
}

public unlock () {
  var packed = JSON.stringify({type: 'unlock'})
  this._ws.send(packed)
}

//
// goodies
//
public tick (timeMs) {
  var packed = JSON.stringify({type: 'tick', timeMs: timeMs})
  this._ws.send(packed)
}

//
// Home
//
public resetHome () {
  console.log('not impl')
}

// helper function
public degreeToStep (degree) {
  return degree / this.stepDegree
}

public stepToDegree (step) {
  return step * this.stepDegree / 128 // XXX: microstep must be supplied
}

public getSpeedPerSecondByStep (step) {
  return Math.pow(2, 28) * step / Math.pow(10, 9) * 250
}

public getSpeedPerSecondByDegree (degree) {
  return this.getSpeedPerSecondByStep(this.degreeToStep(degree))
}
}

export default Webmo;
