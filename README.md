# mychat with Elysia/Bun

[![image](https://github.com/toshirot/mychat/assets/154680/bad677a9-2783-4617-964e-63d48ada5a25)](http://74.226.208.203:9012/)

# macOS と Linux 用の Bun インストール

## advance preparations 事前準備
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

## clone mychat
```
git clone https://github.com/toshirot/mychat.git
source /home/tato/.bashrc
or
git clone git@github.com:toshirot/mychat.git
source /home/tato/.bashrc
```

## Bun initialization
```
cd mychat
```
```
bun init
```
## Execution at port 9012
```
bun dev

e.g. "dev": "bun run --hot src/index-9012.ts"
```
if you want to change the port, change "const PORT = 9012;".
Here, the default is "PORT = 9012", so if you want to use it as is, you will need to open that port.

ポートを変更したい場合は「const PORT = 9012;」を変更してください。
ここでは、デフォルトで「PORT = 9012」としているので、もしそのまま使うならそのポートを開いておく必要があります。

## test

```
bun test
```

## Demo

http://74.226.208.203:9011/

## @see Qiita
Simple Documentation for v0.1.018
https://qiita.com/toshirot/items/d4664e7fdcdde468f501

## default pakage.json at v0.1.020
```
{
  "name": "mychat",
  "version": "0.1.020",
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
    "elysia": "0.7.30"
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
