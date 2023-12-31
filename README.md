# mychat with Elysia/Bun

## Bun install
```
curl https://bun.sh/install | bash
```
## crone mychat
```
git clone https://github.com/toshirot/mychat.git
or 
git clone git@github.com:toshirot/mychat.git
```
## Bun初期化
```
bun init
```
## 実行 at port 9012
```
bun dev
```

## default pakage.json
```
{
  "name": "mychat",
  "version": "0.1.016",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "bun run --hot src/index-9012.ts"
  },
  "dependencies": {
    "@elysiajs/cookie": "^0.8.0",
    "@elysiajs/html": "^0.7.3",
    "@elysiajs/static": "^0.8.1",
    "crypto": "^1.0.1",
    "elysia": "latest"
  },
  "devDependencies": {
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