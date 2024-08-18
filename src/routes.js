import { Database } from './databse.js';
import { Router } from './utils/router.js';

const database = new Database();
const router = new Router();

router.get('/users', function (request, response) {
  const { search } = request.query;

  const users = database.select('users', search ? {
    name: search,
    email: search
  }: null);

  return response.end(JSON.stringify(users));
});

router.get('/users/:userId', function (request, response) {
  const { userId } = request.params;
  const user = database.find('users', userId);
  return response.end(JSON.stringify({ user }));
});

router.post('/users', function (request, response) {
  const { name, email } = request.body;

  const user = { name, email };

  database.insert('users', user);

  return response.writeHead(201).end();
});

router.delete('/users/:userId', function (request, response) {
  const { userId } = request.params;
  database.delete('users', userId);
  return response.writeHead(204).end();
});

router.put('/users/:userId', function (request, response) {
  const { name, email } = request.body;
  const { userId } = request.params;
  
  database.update('users', userId, { name, email });

  return response.writeHead(204).end();
});

export { router };