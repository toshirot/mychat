# mychat v0.1.026 with Elysia/Bun

<a href="http://74.226.208.203:9013/"> ![image](https://github.com/toshirot/mychat/assets/154680/b809beaa-0e64-4e57-a288-09572c2d4aae) </a>

## Demo/ 動作サンプル

http://74.226.208.203:9013/

# MacOS と Linux 用の Bun インストール

## Advance preparations/ 事前準備
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
source /home/tato/.bashrc
or
git clone git@github.com:toshirot/mychat.git
source /home/tato/.bashrc
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

e.g. "dev": "bun run --hot src/index-9012.tsx"
```
if you want to change the port, change "const PORT = 9012;".
Here, the default is "PORT = 9012", so if you want to use it as is, you will need to open that port.

ポートを変更したい場合は「const PORT = 9012;」を変更してください。
ここでは、デフォルトで「PORT = 9012」としているので、もしそのまま使うならそのポートを開いておく必要があります。

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

v0.1.024現在まだパスフレーズをハードコードしてますが、今後修正します。
現況データは次のようにAESで暗号化されて送受信されます。

![image](https://github.com/toshirot/mychat/assets/154680/94d387f5-856f-4ab5-bd9a-6eae2b4ce1eb)

## Sanitize/ サニタイズについて

普通はサニタイズは、サーバー側でやれば良いのだけど、end-to-endで暗号化すると、サーバー側は全く読めなくなるので、サニタイズもできない。そこで、クライアント側で送信側と受信側で2回やってる

クライアント送信側だけでも良さそうだけど、まぁ何があるかわからないので、一応念のために受信側でもやってみた。そのうち問題なければ解除しても良い。

## メッセージ中のURLと画像URL変換について

<li>画像urlを img 要素に変換する
<li>urlをlink 要素 に変換する
<br>※画像urlの判定は現状拡張子のみ

## @see Qiita
Simple Documentation for v0.1.017
ただし、Qiitaでは、v0.1.017までの解説をしています。
https://qiita.com/toshirot/items/d4664e7fdcdde468f501


## Tree at v0.1.026

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

```
{
  "name": "mychat",
  "version": "0.1.026",
  "scripts": {
    "test": "bun test",
    "dev": "bun run --hot src/index-9012.tsx"
  },
  "dependencies": {
    "@elysiajs/cookie": "^0.8.0",
    "@elysiajs/html": "^0.7.3",
    "@elysiajs/static": "^0.8.1",
    "@types/crypto-js": "^4.2.1",
    "crypto": "^1.0.1",
    "crypto-js": "^4.2.0",
    "elysia": "0.7.30",
    "sanitize-filename": "^1.6.3"
  },
  "devDependencies": {
    "@happy-dom/global-registrator": "^12.10.3",
    "@types/bun": "^1.0.0",
    "bun-types": "latest"
  },
  "module": "src/index.js",
  "type": "module",
  "peerDependencies": {
    "typescript": "^5.0.0"
  }
}
```
