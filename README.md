# mychat with Elysia/Bun

[![image](https://github.com/toshirot/mychat/assets/154680/bad677a9-2783-4617-964e-63d48ada5a25)](http://74.226.208.203:9012/)


## Bun install
```
curl https://bun.sh/install | bash
```
## clone mychat
```
git clone https://github.com/toshirot/mychat.git
```
or 
```
git clone git@github.com:toshirot/mychat.git
```
## Bun initialization
```
bun init
```
## Execution at port 9012
```
bun dev

e.g. "dev": "bun run --hot src/index-9012.ts"
```
To change the host name, change "const HOST = 'example.com';" in the index-9012.ts file to localhost, domain name or IP address (xxx.xxx.xxx.xxx.xxx).
And if you want to change the port, change "const PORT = 9012;".

## @see Qiita
Simple Documentation for v0.1.017
https://qiita.com/toshirot/items/d4664e7fdcdde468f501

## default pakage.json at v0.1.017
```
{
  "name": "mychat",
  "version": "0.1.017",
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
