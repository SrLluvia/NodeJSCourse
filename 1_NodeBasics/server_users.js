const http = require('http');
const routes_users = require('./routes_users');

const server = http.createServer(routes_users);

server.listen(6006);