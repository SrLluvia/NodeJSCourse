//require = import in nodejs
const http = require('http');

/*
//req = request
//res = response
function rqListener(req, res){

}

//rqListener will execute for every incoming request
http.createServer(rqListener);
*/

//With anonymous function
const server = http.createServer((req, res) => {
    console.log(req);
});

//Starts a process where nodejs will keep running listening for incoming requests
//listen(port, hostname)
server.listen(3000);