const http = require('http'),
    fs = require('fs'),
    path = require('path');

const httpServer = http.createServer((req, res) => {

    switch (req.url) {
        case '/':
            fs.readFile(path.resolve(__dirname, './dist/index.html'), 'utf-8', (err, fileBuf) => {
                res.write(fileBuf);
                res.end();
            });
            break;
        case '/breakout.js':
            fs.readFile(path.resolve(__dirname, './dist/breakout.js'), 'utf-8', (err, fileBuf) => {
                res.write(fileBuf);
                res.end();
            });
            break;
        default:
            res.write('<h1>Error 404</h1>');
            res.end();
    }
}).listen(5000);