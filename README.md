# mychat with Elysia/Bun

![image](https://github.com/toshirot/mychat/assets/154680/c4ef7aa2-7f31-4440-9ca5-281a2da7bc83)


## Demo/ 動作サンプル

http://74.226.208.203:9011/

# macOS と Linux 用の Bun インストール

## advance preparations/ 事前準備
for Linux: Bun をインストールするにはunzipパッケージが必要です。入っていなければ入れておきます。
```
sudo apt install unzip 
```
## Bun install
```
curl -fsSL https://bun.sh/install | bash
or
curl -fsSL https://bun.sh/install | bash -s "bun-v1.0.0"

```

# Windows 用の Bun インストール

## Bun install

警告: 実験的な Windows ビルドでは安定性は保証されません。
@see  https://bun.sh/docs/installation#windows

```
powershell -c "iwr bun.sh/install.ps1|iex"
```

# 以下は 各OS 共通

## clone mychat/ クローンで mychat をダウンロードする
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
```
bun dev

e.g. "dev": "bun run --hot src/index-9012.ts"
```
if you want to change the port, change "const PORT = 9012;".
Here, the default is "PORT = 9012", so if you want to use it as is, you will need to open that port.

ポートを変更したい場合は「const PORT = 9012;」を変更してください。
ここでは、デフォルトで「PORT = 9012」としているので、もしそのまま使うならそのポートを開いておく必要があります。

## test/ テスト

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

## @see Qiita
Simple Documentation for v0.1.017
ただし、Qiitaでは、v0.1.017までの解説をしています。
https://qiita.com/toshirot/items/d4664e7fdcdde468f501


## Tree at v0.1.021

```
.mychat/
  ├─ src/
  │    ├─ index-9012.ts // bun dev で起動するファイル
  │    └─ utiles.ts     // 各種関数
  ├─ public/            // static ディレクトリ
  │    └─ css/          // static CSS
  │        ├─ base.css 
  │        ├─ input-box.css
  │        └─ msg-box.css
  ├─ db/
  │    ├─ mychat.sqlite     // 通常の SQLiteファイル
  │    ├─ mychat.sqlite-shm // WALモード用ファイル
  │    └─ mychat.sqlite-wal // WALモード用ファイル
  │ 
  ├─ bench/           // ベンチマーク
  ├─ test/            // テスト bun test で起動する
  ├─ README.md
  ├─ bun.lockb
  ├─ node_modules/
  ├─ happydom.ts
  ├─ package.json
  ├─ bunfig.toml
  └─ tsconfig.json
 
```

## default pakage.json at v0.1.021
```
{
  "name": "mychat",
  "version": "0.1.021",
  "scripts": {
    "test": "bun test",
    "dev": "bun run --hot src/index-9012.ts"
  },
  "dependencies": {
    "@elysiajs/cookie": "^0.8.0",
    "@elysiajs/html": "^0.7.3",
    "@elysiajs/static": "^0.8.1",
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
