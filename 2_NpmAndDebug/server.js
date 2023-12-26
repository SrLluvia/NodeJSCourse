//require = import in nodejs
const http = require('http');
// ./ means its local
const routes = require('./routes');

/*
//req = request
//res = response
function rqListener(req, res){
}

//rqListener will execute for every incoming request
http.createServer(rqListener);
*/

//Uses the function routes
const server = http.createServer(routes);

//Starts a process where nodejs will keep running listening for incoming requests
//listen(port, hostname)
server.listen(3000);