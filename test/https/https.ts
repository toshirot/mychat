import { Elysia } from 'elysia';
const PORT = 9014;
const KEYS = {
    cert: Bun.file("/etc/letsencrypt/live/mychat.jp/cert.pem"),
    key: Bun.file("/etc/letsencrypt/live/mychat.jp/privkey.pem")
}

const app = new Elysia()
  .get('/', () => 'my https server is running!')

  .listen({
        port: PORT,
        tls: KEYS
    },  (token: any) => {
        if (token) {
            console.log(`Listening to port ${PORT}`);
        } else {
            console.error(`Failed to listen to port ${PORT}`);
        }
    })

    /*

https://mychat.jp:9014/
my https server is running!*/