// Requires
const http = require('http');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

// Port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// url map
const urlStruct = {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/addUser': jsonHandler.addUser,
    '/getUsers': jsonHandler.getUsers,
    notFound: jsonHandler.notFound,
};

// parse body
const parseBody = (request, response, handler) => {
    const body = [];

    // error event handler
    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    // get data event
    request.on('data', (chunk) => {
        body.push(chunk);
    });

    //final event
    request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        request.body = query.parse(bodyString);
        handler(request, response);
    });
};

// handle post requests (this is for adding users)
const handlePost = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/addUser') {
        parseBody(request, response, jsonHandler.addUser);
    }
};
const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    //post
    if (request.method === 'POST') {
        return handlePost(request, response, parsedUrl);
    }

    //other paths
    if (urlStruct[parsedUrl.pathname]) {
        return urlStruct[parsedUrl.pathname](request, response);
    }
    
    //otherwise it is not a relevant path
    return urlStruct.notFound(request, response);
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
});