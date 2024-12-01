# mychat v0.1.04x with Elysia/Bun

mychat is an end-to-end encrypted chat. It cannot be viewed on the server side.
<br>mychatはエンドツーエンドの暗号化チャットです。サーバー側では閲覧できません。


<a href="http://74.226.208.203:9013/"> ![image](https://github.com/toshirot/mychat/assets/154680/a3308562-78b1-4af7-8d7e-1efed616da50)
</a>

## Demo/ 動作サンプル

v0.1.030からhttpsになりました

2024/12/1 Demoはクラウド移転のメンテナンス中
[https://mychat.jp:9013/](https://mychat.jp:9013/)

# MacOS と Linux 用の Bun インストール

## Advance preparations/ 事前準備

#### unzipインストールして準備する
for Linux: Bun をインストールするにはunzipパッケージが必要です。入っていなければ入れておきます。
```
sudo apt install unzip 
```

## Bun install/ Bunインストール
```
curl -fsSL https://bun.sh/install | bash
or
curl -fsSL https://bun.sh/install | bash -s "bun-v1.0.25"

```

## Clone mychat/ クローンで mychat をダウンロードする
```
git clone https://github.com/toshirot/mychat.git
source /home/＜ユーザー名＞/.bashrc
or
git clone git@github.com:toshirot/mychat.git
source /home/＜ユーザー名＞/.bashrc
```

## Bun initialization/ Bunを初期化する
```
cd mychat
```
```
bun init
```
## Execution at port 9012/ ポート9012で実行する
※v0.1.023から「.tsx」ファイルを起動しています

```
bun dev

e.g. "dev": "sudo bun run --hot src/index-9012.tsx"
```
if you want to change the port, change "const PORT = 9012;".
Here, the default is "PORT = 9012", so if you want to use it as is, you will need to open that port.

ポートなどを変更したい場合は「const PORT = 9012;」等で変更してください。
ここでは、デフォルトで「PORT = 9012」としていますが、そのポートを開いておく必要があります。

```
// 修正箇所 src/index-9012.tsx

// ホストまたはIP
const HOST = '74.226.208.203' //←ここを自分の使うHOSTへ変更する
// ポート HTTP と WebSocket 共通
const PORT = 9012; //←ここを自分の使うPORTへ変更する
```
#### v0.1.030からの https 化を準備する
v0.1.030からは httpではなく https で起動します。
もし既に、ドメイン持ってるサイト内に構築するならsrc/index-9012.tsx などに証明書のパスを書くだけで良いですが、
証明書が無い場合は、ドメインとletsencryptなどの証明書を各自ご用意ください。

コード上は以下のように 環境変数envを使っています。各envに証明書を登録するか、コメントアウトしているpemファイルへのパスの方を使うかはご自由に選択されてください。
```
const KEYS = {
    cert: process.env.MYCHAT_CERT, 
    key:  process.env.MYCHAT_PRIV
   // cert: Bun.file("/etc/letsencrypt/live/"+HOST+"/cert.pem"),
   // key: Bun.file("/etc/letsencrypt/live/"+HOST+"/privkey.pem")
}
```

また、sudoでの権限で bun 実行権限も必要なので、
下記のように sudo bun が実行できることが必要かもしれません。

※httpバージョンは、v0.1.026までになります
```
#sudo bun が実行できるようにする
#bunのパスを調べる
$ which bun
/home/＜ユーザー名＞/.bun/bin/bun
#ルートへリンクする
sudo ln -s /home/＜ユーザー名＞/.bun/bin/bun /usr/bin/bun
# /usr/bin/bunがリンクされてることを確認 これで sudo bun が動作します
$ sudo ls -l /usr/bin/bun
lrwxrwxrwx 1 root root 23  3月 31 00:22 /usr/bin/bun -> /home/＜ユーザー名＞/.bun/bin/bun
```

## Test/ テスト

現在、testの実行に問題があります。https://github.com/toshirot/mychat/issues/8

※/test/crypto/encrypt-decrypt.test.ts　で「process.env.PASS_PHRASE」を使ってるので
事前にenv.PASS_PHRASEに何かパスフレーズな文字列を入れておいてください。
たとえば、こんな感じで。
```
 $ export PASS_PHRASE="mypassphrase"
```
テストの実行
```
bun test
```

## Crypto/ 暗号化について

@see https://github.com/toshirot/mychat/issues/2

v0.1.040でパスフレーズを実装しました。
現況データは次のようにAESで暗号化されて送受信されます。

![image](https://github.com/toshirot/mychat/assets/154680/94d387f5-856f-4ab5-bd9a-6eae2b4ce1eb)

## Sanitize/ サニタイズについて

普通はサニタイズは、サーバー側でやれば良いのだけど、end-to-endで暗号化すると、サーバー側は全く読めなくなるので、サニタイズもできない。そこで、クライアント側で送信側と受信側で2回やってる

クライアント送信側だけでも良さそうだけど、まぁ何があるかわからないので、一応念のために受信側でもやってみた。そのうち問題なければ解除しても良い。

## メッセージ中のURLと画像URL変換について

<li>画像urlを img 要素に変換する
<li>urlをlink 要素 に変換する
<br>※画像urlの判定は現状拡張子のみ

## Discussions/ ディスカッション
[https://github.com/toshirot/mychat/discussions/13](https://github.com/toshirot/mychat/discussions)

## @see Qiita
Simple Documentation for v0.1.017
ただし、Qiitaでは、v0.1.017までの解説をしています。
https://qiita.com/toshirot/items/d4664e7fdcdde468f501


## Tree at v0.1.031

```
.mychat/
  ├─ src/
  │    ├─ index-9012.tsx    // bun dev で起動するファイル
  │    └─ utiles.ts         // 各種関数
  ├─ public/                // static ディレクトリ
  │    ├─ css/              // static CSS
  │    │   ├─ base.css      // ベースCSS
  │    │   ├─ input-box.css // インプットボックスCSS
  │    │   └─ msg-box.css   // メッセージボックスCSS
  │    ├─ img
  │    │   └─ config-icon.png
  │    └─ js
  │        ├─ cripto-js.js  // 暗号/復号
  │        └─ purify.min.js // サニタイズ
  ├─ db/
  │    ├─ mychat.sqlite     // 通常の SQLiteファイル
  │    ├─ mychat.sqlite-shm // WALモード用ファイル
  │    ├─ mychat.sqlite-wal // WALモード用ファイル
  │ 
  ├─ bench/                 // ベンチマーク
  ├─ test/                  // テスト bun test で起動する
  ├─ README.md
  ├─ bun.lockb              // @see https://bun.sh/docs/install/lockfile
  ├─ node_modules/
  ├─ happydom.ts            // @see https://bun.sh/guides/test/happy-dom
  ├─ package.json
  ├─ bunfig.toml            // @see https://bun.sh/docs/runtime/bunfig
  └─ tsconfig.json          // @see https://bun.sh/docs/runtime/jsx#configuration
 
```

## Default pakage.json

#### 注意※2023/1/7　 "elysia": "0.7.30",　が "elysia": "0.8.00" だとエラーがでた

* v0.1.030からdevは sudo で実行しています

```
{
  "name": "mychat",
  "version": "0.1.042",
  "scripts": {
    "test": "bun test",
    "dev": "sudo bun run --hot src/index-9012.tsx",
    "action": "sudo bun run src/index-9012.tsx;process.exit();"
  },
  "dependencies": {
    "@elysiajs/cookie": "^0.8.0",
    "@elysiajs/html": "^0.7.3",
    "@elysiajs/static": "^0.8.1",
    "@types/crypto-js": "^4.2.1",
    "@types/dotenv": "^8.2.0",
    "@types/node": "^20.12.11",
    "cookie-parser": "^1.4.6",
    "crypto": "^1.0.1",
    "crypto-js": "^4.2.0",
    "elysia": "0.7.30",
    "express-session": "^1.18.0",
    "passport": "^0.7.0",
    "passport-google-oauth2": "^0.2.0",
    "qrcode": "^1.5.3",
    "sanitize-filename": "^1.6.3",
    "speakeasy": "^2.0.0"
  },
  "devDependencies": {
    "@happy-dom/global-registrator": "^12.10.3",
    "@types/bun": "^1.0.0",
    "bun-types": "latest"
  },
  "module": "src/index-9012.tsx",
  "type": "module",
  "peerDependencies": {
    "typescript": "^5.0.0"
  }
}

```
