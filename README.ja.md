[English](./README.md) | 日本語
---

<div align="center">
    <h1>
        <img src="https://user-images.githubusercontent.com/1403842/73547507-70f89d00-4482-11ea-9559-545e5f82459a.png" alt="json-editor-app logo" width="120"/><br/>
        JSON Editor
    </h1>
    <i>シンプルなJSONエディター。Win & Mac用。</i>
</div>

![Screenshot of json-editor-app v0.0.4 on macOS](https://user-images.githubusercontent.com/1403842/73547401-2ecf5b80-4482-11ea-8b03-753c1621c116.png)

このアプリは[josdejong/jsoneditor](https://github.com/josdejong/jsoneditor)をデスクトップ用に移植した物です。
@josdejongに感謝します。

## インストール方法

最新のリリースページからzipファイルをダウンロードしてください。
zipファイルを解凍するとアプリ本体が出てくるので、適当な場所に保存すればインストール完了です。

https://github.com/fand/json-editor-app/releases/latest

Macの場合は「開発元が未確認のため開けません」と表示されてしまうので、初回の起動時は以下の手順で起動してください。

- アプリを右クリックしてメニューを表示し、「開く」をクリック
- 確認ウィンドウが表示されるので、もう一度「開く」をクリック
- 起動成功！

2回目以降は普通にダブルクリックで起動できます。


## `.json` ファイルとの関連付け

JSONファイルを開く際に、JSON Editorで開くようにしておくと便利です。

### Windows

- エクスプローラーで適当なJSONファイルを右クリックし、「プログラムから開く」をクリック
- 「常にこのアプリを使ってファイルを開く」にチェックを入れる
- 「このPCで別のアプリを探す」をクリック
- `JSON Editor.exe` を選択
- 完了

### Mac

- Finderで適当なJSONファイルを右クリックし、「情報を見る」をクリック
- 「このアプリケーションで開く」をクリックし、「その他」を選択
- `JSON Editor` を選択
- 「このアプリケーションで開く」の下の「すべてを変更」ボタンをクリック
- 完了


## 使い方

- `OPEN` ボタンでファイルを開く
- `SAVE` ボタンでファイルを保存
- `PREVIEW` ボタンでプレビューモード切り替え

あとは適当にクリックしてみてください。

## ライセンス

MIT
