
import { Elysia } from 'elysia';
// Server
const app = new Elysia()
    .get('/data',  ({ body }) =>  {return body})
    .post('/data',  ({ body }) => body)
    .listen(9017)