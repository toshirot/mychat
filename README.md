# mychat with Elysia/Bun

## Bun install
```
curl https://bun.sh/install | bash
```
## clone mychat
```
git clone https://github.com/toshirot/mychat.git
or 
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


## default pakage.json at v0.1.016
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