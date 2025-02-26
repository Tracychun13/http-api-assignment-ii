//user object
const users = {};

const respondJSON = (request, response, status, object) => {

    const content = JSON.stringify(object);

    //send response
    const headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    };
    response.writeHead(status, headers);

    //get head
    if (request.method !== 'HEAD') {
        response.write(content);
    }

    response.end();
};


//get all users in the list as a JSON obj
const getUsers = (request, response) => {
    //response object
    const responseJSON = {
        users,
    };

    return respondJSON(request, response, 200, responseJSON);
};



//add a new user if they don't exist yet
const addUser = (request, response) => {
    
    const responseJSON = {
        message: 'Name and age are both required.',
    };

    //get the name and age from request
    const { name, age } = request.body;

    //check if we have both fields
    if (!name || !age) {
        responseJSON.id = 'addUSerMissingParams';
        return respondJSON(request, response, 400, responseJSON);
    }

    // otherwise assume we are adding new user and default the response code to 204
    let responseCode = 204;

    // If the user doesn't exist yet
    if (!users[name]) {
        responseCode = 201;
        users[name] = {
            name,
        };
    }

    //update  
    users[name].age = age;

    //user was created successfully
    if (responseCode === 201) {
        responseJSON.message = 'Created Successfully';
        return respondJSON(request, response, responseCode, responseJSON);
    }

    //empty body
    return respondJSON(request, response, responseCode, {});
};


//not a path, page doesn't exist
const notFound = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };

    //error message
    respondJSON(request, response, 404, responseJSON);
};

//export
module.exports = {
    getUsers,
    addUser,
    notFound,
};