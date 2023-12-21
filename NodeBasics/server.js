//require = import in nodejs
const http = require('http');
const fs = require('fs');

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
    const url = req.url;
    const method = req.method;
    if(url === '/'){
        res.write('<html>');
        res.write('<head><title>Enter info</title></head>');
        res.write('<body><form action="/info" method="POST"><input type="text" name="info"><button type="submit">Send!</button></body>');
        res.write('</html>');
        //Not required to return a res, but to not continue with the code
        return res.end();
    }

    //Has to match previous res
    if(url === '/info' && method === 'POST'){
        const body = [];
        //data event will execute whenever a new chunk is ready to be read
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        //when the is no more data to read
        req.on('end', () => {
            //add all the chunks
            const parsedBody = Buffer.concat(body).toString();
            const info = parsedBody.split('=')[1];
            fs.writeFileSync('info.txt', info);
        });
        //302 = redirection
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
    }

    //Attach header to res with metadata info 
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My first page!</title></head>');
    res.write('<body>Hello world from nodejs!</body>');
    res.write('</html>');
    res.end();
    //process.exit();
});

//Starts a process where nodejs will keep running listening for incoming requests
//listen(port, hostname)
server.listen(3000);