# webmo-client
[Webmo](http://webmo.io/) のためのNode.js用ライブラリです。

## Examples

### Node.jsで使う

```
npm install webmo-client-nodejs --save
```

#### 例: 毎秒90度のスピードで回転して2秒後に止まる
```
var WebmoWs = require('webmo-client').ws
var motor = new WebmoWs("webmo.local")

motor.onopen = () => {
  motor.rotate(90)
  setTimeout(() => { motor.stop() }, 2000)
}
```

## サポートするWebmoのソフトウェアバージョン
`v0.1.0`-`v0.1.1`

## License
MIT License
