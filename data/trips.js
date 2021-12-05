const { ObjectID, ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

const create = async(id, destination, startDate, endDate) => {
    if(!id) throw "must provide an id";
    if(typeof id != "string" || id.replace(/\s/g, '') == "") throw "id must be a valid string";
    if(!id.match(/^[0-9a-fA-F]{24}$/)) throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
    if(!destination || !startDate || !endDate || !id) throw "All inputs must have values!";
    if(typeof destination != "string") throw "destination must be a string";
    if(typeof startDate != "object" || typeof endDate != "object") throw "must be objects!";
    
    let userList = await users();
    let user = await userList.findOne({ _id: ObjectId(id) });
    if(user === null) throw "no user found";
    
    let theTrip = {
        _id: new ObjectId(),
        destination: destination,
        startDate: startDate,
        endDate: endDate,
        flights: 0,
        hotel_stays: 0,
        activities: 0,
        theActivities: []
    }
    
    user.trips.push(theTrip);

    let updatedInfo = await userList.updateOne({_id: ObjectId(id)}, {$set: user});
    if(updatedInfo.modifiedCount === 0) throw "could not update book";

    return true;
};

const readAll = async(id) => {
    if(!id) throw "must provide an id";
    if(typeof id != "string" || id.replace(/\s/g, '') == "") throw "id must be a valid string";
    if(!id.match(/^[0-9a-fA-F]{24}$/)) throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid

    let userList = await users();
    let user = await userList.findOne({ _id: ObjectId(id) });
    if(user === null) throw "no user found";

    return user.trips;
};

const read = async(id, tripid) => {
    if(!id) throw "must provide an id";
    if(typeof id != "string" || id.replace(/\s/g, '') == "") throw "id must be a valid string";
    if(!id.match(/^[0-9a-fA-F]{24}$/)) throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
    if(!tripid) throw "must provide an tripid";
    if(typeof tripid != "string" || tripid.replace(/\s/g, '') == "") throw "tripid must be a valid string";
    if(!tripid.match(/^[0-9a-fA-F]{24}$/)) throw "tripid must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid

    let userList = await users();
    let user = await userList.findOne({ _id: ObjectId(id) });
    if(user === null) throw "no user found";

    let theTrip = [];
    for(let x in user.trips) {
        if(user.trips[x]._id.toString() == tripid) {
            theTrip = user.trips[x];
        }
    }
    return theTrip;
};

const update = async(id, tripid, destination, startDate, endDate) => {
    if(!id) throw "must provide an id";
    if(typeof id != "string" || id.replace(/\s/g, '') == "") throw "id must be a valid string";
    if(!id.match(/^[0-9a-fA-F]{24}$/)) throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
    if(!tripid) throw "must provide an id";
    if(typeof tripid != "string" || tripid.replace(/\s/g, '') == "") throw "id must be a valid string";
    if(!tripid.match(/^[0-9a-fA-F]{24}$/)) throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
    if(!destination || !startDate || !endDate || !id) throw "All inputs must have values!";
    if(typeof destination != "string") throw "destination must be a string";
    if(typeof startDate != "object" || typeof endDate != "object") throw "must be objects!";
    
    let userList = await users();
    let user = await userList.findOne({ _id: ObjectId(id) });
    if(user === null) throw "no user found";

    let theTrip = [];
    let tripIndex;
    for(let x in user.trips) {
        if(user.trips[x]._id.toString() == tripid) {
            theTrip = user.trips[x];
            tripIndex = x;
        }
    }
    if(theTrip == []) throw "Could not find trip";

    theTrip.destination = destination;
    theTrip.startDate = startDate;
    theTrip.endDate = endDate;
    user.trips[tripIndex] = theTrip;

    let updatedInfo = await userList.updateOne({_id: ObjectId(id)}, {$set: user});
    if(updatedInfo.modifiedCount === 0) throw "could not update book";

    return true;
};

const remove = async(id, tripid) => {
    if(!id) throw "must provide an id";
    if(typeof id != "string" || id.replace(/\s/g, '') == "") throw "id must be a valid string";
    if(!id.match(/^[0-9a-fA-F]{24}$/)) throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
    if(!tripid) throw "must provide an id";
    if(typeof tripid != "string" || tripid.replace(/\s/g, '') == "") throw "id must be a valid string";
    if(!tripid.match(/^[0-9a-fA-F]{24}$/)) throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
    
    let userList = await users();
    let user = await userList.findOne({ _id: ObjectId(id) });
    if(user === null) throw "no user found";

    let theTrip = [];
    let tripIndex;
    for(let x in user.trips) {
        if(user.trips[x]._id.toString() == tripid) {
            theTrip = user.trips[x];
            tripIndex = x;
        }
    }
    if(theTrip == []) throw "Could not find trip";

    user.trips.splice(tripIndex, 1);

    let updatedInfo = await userList.updateOne({_id: ObjectId(id)}, {$set: user});
    if(updatedInfo.modifiedCount === 0) throw "could not update book";

    return true;
};

module.exports = {
    description: "Activities Functions",
    create,
    readAll,
    read,
    update,
    remove
};