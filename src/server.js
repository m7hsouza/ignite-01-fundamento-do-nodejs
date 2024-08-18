import http from 'node:http';

import { json } from './middlewares/json.js';
import { router } from './routes.js';

const server = http.createServer(async function (request, response) {
  await json(request, response);
  return router.handler(request, response);
});

server.listen(3333);