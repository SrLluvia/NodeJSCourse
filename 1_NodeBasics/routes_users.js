const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;    
    const method = req.method

    if(url === '/'){
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Weclome to slash</title></head>');
        res.write('<body><h1>Welcome to slash</h1></body>');
        res.write('<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Send username</button>');
        res.write('</html>');
        return res.end();
    }
    
    if(url === '/users'){
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Weclome to slash</title></head>');
        res.write('<body><ul><li>User 1</li><li>User 2</li><li>User 4</li></body>');
        res.write('</html>');
        return res.end();
    }

    if(url === '/create-user' && method === 'POST'){
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const username = parsedBody.split('=')[1];
            console.log("Username: " + username);
            res.statusCode = 302;
            res.setHeader('Location', '/');
            return res.end();
        });
        
    }
}

//Global object
module.exports = requestHandler;


