
import { Elysia } from 'elysia';
// Server
const app = new Elysia()
    .post('/data',  ({ body }) => body)
    .listen(9017)