export const json = async function (request, response) {
  const buffers = [];
  
  for await (const chunck of request) {
    buffers.push(chunck);
  }

  const bufferedString = Buffer.concat(buffers).toString();

  request.body = bufferedString ? JSON.parse(bufferedString) : null;

  response.setHeader('Content-Type', 'application/json');
}