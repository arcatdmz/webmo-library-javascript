# webmo-client-nodejs

[Webmo](http://webmo.io/) のためのNode.js用ライブラリです。本家ライブラリがNode.jsで動作しなかったため、forkしてコードを整備しました。

## 使う準備

[Node.js](https://nodejs.org/) がインストールされたマシンで適当なフォルダを作り、以下のコマンドを実行します。

```
npm init -y
npm install webmo-client-nodejs --save
```

## 使い方

毎秒90度のスピードで回転して2秒後に止まるコードは以下のようになります。前のステップで作ったフォルダ内に `index.js` として保存し、 `node .` を実行するとWebmoが動きます。

```
var WebmoWs = require('webmo-client-nodejs').ws
var motor = new WebmoWs("webmo.local")

motor.onopen = () => {
  motor.rotate(90)
  setTimeout(() => { motor.stop(); motor.close(); }, 2000)
}
```

詳しいAPIドキュメントは本家の [Webmo JavaScript Client Library "webmo.js"ドキュメント](http://webmo.io/jsdocs.html) を参照してください。2017/7/20時点で本家最新版と同等のAPIを提供しています。

## サポートするWebmoのソフトウェアバージョン
`v0.1.0` - `v0.1.3`

## ライセンス
[MIT License](https://github.com/arcatdmz/webmo-library-nodejs/blob/master/LICENSE)
