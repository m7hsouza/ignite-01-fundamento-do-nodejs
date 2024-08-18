import Url from 'node:url';

import { buildRoutePath } from './build-route-path.js';

export class Router {

  #routes = [];

  #makeRoute(method, path, handler) {
    this.#routes.push({
      method,
      handler,
      path: buildRoutePath(path),
    });
  }
 
  get(path, handler) {
    this.#makeRoute('GET', path, handler);
    return this;
  }

  post(path, handler) {
    this.#makeRoute('POST', path, handler);
    return this;
  }

  delete(path, handler) {
    this.#makeRoute('DELETE', path, handler);
    return this;
  }

  put(path, handler) {
    this.#makeRoute('PUT', path, handler);
    return this;
  }

  handler(request, response) {
    const route = this.#routes.find(route => {
      return route.method === request.method && route.path.test(request.url)
    });

    if (route) {
      const routeParams = request.url.match(route.path);
      request.query = { ...Url.parse(request.url, true).query };
      request.params = { ...routeParams.groups };
      return route.handler(request, response);
    }

    return response.writeHead(404).end();
  }

}