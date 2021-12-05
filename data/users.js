const { ObjectID, ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

const create = async(username, password) => {
    if(!username || typeof username != "string" || username.replace(/\s/g, '') == "") throw "Invalid username";
    if(!password || typeof password != "string" || password.replace(/\s/g, '') == "") throw "Invalid password";

    let userList = await users();

    let newUser = {
        username: username,
        password: password,
        trips: []
    };

    let insert = await userList.insertOne(newUser);
    if(insert.insertedCount === 0) throw 'Could not add book';
    
    let newId = insert.insertedId;

    let user = await userList.findOne(newId);
    user._id = user._id.toString();
    return user;
};

const read = async(id) => {
    if(!id) throw "must provide an id";
    if(typeof id != "string" || id.replace(/\s/g, '') == "") throw "id must be a valid string";
    if(!id.match(/^[0-9a-fA-F]{24}$/)) throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid

    let objectId = ObjectId(id);
    let userList = await users();

    let user = await userList.findOne({ _id: objectId});
    if(user === null) throw "no book with that id";

    user._id = user._id.toString();

    return user;
};  

const readUsername = async(username) => {
    if(!username) throw "must provide a username";
    if(typeof username != "string" || username.replace(/\s/g, '') == "") throw "username must be a valid string";

    let userList = await users();

    let user = await userList.findOne({ username: username });
    if(user === null) return null;

    user._id = user._id.toString();

    return user;
}

const login = async(username, password) => {
    if(!username || typeof username != "string" || username.replace(/\s/g, '') == "") throw "Invalid username";
    if(!password || typeof password != "string" || password.replace(/\s/g, '') == "") throw "Invalid username";

    let userList = await users();
    let user = await userList.findOne({ username: username });
    if(user === null) return null;
    if(user.password != password) return null;

    return user;
}

const update = async(id, username, password) => {
    if(!username || typeof username != "string" || username.replace(/\s/g, '') == "") throw "Invalid username";
    if(!password || typeof password != "string" || password.replace(/\s/g, '') == "") throw "Invalid password";
    if(!id) throw "must provide an id";
    if(typeof id != "string" || id.replace(/\s/g, '') == "") throw "id must be a valid string";
    if(!id.match(/^[0-9a-fA-F]{24}$/)) throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid

    let userList = await users();
    let user = await userList.findOne({ _id: ObjectId(id) });
    if(user === null) return null;

    let newUser = {
        username: username,
        password: password
    }

    let updatedInfo = await userList.updateOne({_id: ObjectId(id)}, {$set: newUser});
    if(updatedInfo.modifiedCount === 0) throw "could not update book";

    newUser._id = user._id.toString();
    return newUser;
};

module.exports = {
    description: "Activities Functions",
    create,
    read,
    readUsername,
    login,
    update
};