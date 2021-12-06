const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;

const create = async (id, tripid, type, info) => {
  if (!id) throw "must provide an id";
  if (typeof id != "string" || id.replace(/\s/g, "") == "")
    throw "id must be a valid string";
  if (!id.match(/^[0-9a-fA-F]{24}$/)) throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
  if (!tripid) throw "must provide an id";
  if (typeof tripid != "string" || tripid.replace(/\s/g, "") == "")
    throw "id must be a valid string";
  if (!tripid.match(/^[0-9a-fA-F]{24}$/)) throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
  if (!type || typeof type != "string" || type.replace(/\s/g, "") == "")
    throw "type must be a valid string";
  if (typeof info != "object") throw "info must be an object";

  let userList = await users();
  let user = await userList.findOne({ _id: ObjectId(id) });
  if (user === null) throw "no user found";
  let theTrip = {};
  let tripId;
  for (let x in user.trips) {
    if (user.trips[x]._id.toString() == tripid) {
      theTrip = user.trips[x];
      tripId = x;
      break;
    }
  }
  if (theTrip === {}) throw "trip not found";

  let theActivity = {
    _id: new ObjectId(),
    type: type,
    info: info,
  };
  theTrip.theActivities.push(theActivity);
  //   console.log(theTrip);
  if (type == "flight") theTrip.flights++;
  else if (type == "hotel_stay") theTrip.hotel_stays++;
  else theTrip.activities++;

  user.trips[tripId] = theTrip;

  let updatedInfo = await userList.updateOne(
    { _id: ObjectId(id) },
    { $set: user }
  );
  if (updatedInfo.modifiedCount === 0) throw "could not update book";

  return true;
};

const readAll = async (id, tripid) => {
  if (!id) throw "must provide an id";
  if (typeof id != "string" || id.replace(/\s/g, "") == "")
    throw "id must be a valid string";
  if (!id.match(/^[0-9a-fA-F]{24}$/)) throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
  if (!tripid) throw "must provide an id";
  if (typeof tripid != "string" || tripid.replace(/\s/g, "") == "")
    throw "id must be a valid string";
  if (!tripid.match(/^[0-9a-fA-F]{24}$/)) throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid

  let userList = await users();
  let user = await userList.findOne({ _id: ObjectId(id) });
  if (user === null) throw "no user found";
  let theActivities = [];
  for (let x in user.trips) {
    if (user.trips[x]._id.toString() == tripid) {
      theActivities = user.trips[x].theActivities;
    }
  }
  return theActivities;
};

const read = async (userid, tripid, activityid) => {
  if (!userid) throw "must provide an id";
  if (typeof userid != "string" || userid.replace(/\s/g, "") == "")
    throw "userid must be a valid string";
  if (!userid.match(/^[0-9a-fA-F]{24}$/)) throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
  if (!tripid) throw "must provide an id";
  if (typeof tripid != "string" || tripid.replace(/\s/g, "") == "")
    throw "tripid must be a valid string";
  if (!tripid.match(/^[0-9a-fA-F]{24}$/)) throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
  if (!activityid) throw "must provide an id";
  if (typeof activityid != "string" || activityid.replace(/\s/g, "") == "")
    throw "activityid must be a valid string";
  if (!activityid.match(/^[0-9a-fA-F]{24}$/))
    throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid

  let userList = await users();
  let user = await userList.findOne({ _id: ObjectId(userid) });
  if (user === null) throw "no user found";

  let theTrip = [];
  for (let x in user.trips) {
    if (user.trips[x]._id.toString() == tripid) {
      theTrip = user.trips[x];
    }
  }
  if (theTrip == []) throw "no trip found";

  let theActivity = [];
  for (let y in theTrip.theActivities) {
    if (theTrip.theActivities[y]._id.toString() == activityid) {
      theActivity = theTrip.theActivities[y];
    }
  }
  if (theActivity == []) throw "no activity found";

  return theActivity;
};

const update = async (userid, tripid, activityid, info) => {
  if (!userid) throw "must provide an id";
  if (typeof userid != "string" || userid.replace(/\s/g, "") == "")
    throw "userid must be a valid string";
  if (!userid.match(/^[0-9a-fA-F]{24}$/)) throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
  if (!tripid) throw "must provide an id";
  if (typeof tripid != "string" || tripid.replace(/\s/g, "") == "")
    throw "tripid must be a valid string";
  if (!tripid.match(/^[0-9a-fA-F]{24}$/)) throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
  if (!activityid) throw "must provide an id";
  if (typeof activityid != "string" || activityid.replace(/\s/g, "") == "")
    throw "activityid must be a valid string";
  if (!activityid.match(/^[0-9a-fA-F]{24}$/))
    throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
  if (!info || typeof info != "object") throw "info must be a valid object";

  let userList = await users();
  let user = await userList.findOne({ _id: ObjectId(userid) });
  if (user === null) throw "no user found";

  let theTrip = [];
  let tripIndex;
  for (let x in user.trips) {
    if (user.trips[x]._id.toString() == tripid) {
      theTrip = user.trips[x];
      tripIndex = x;
    }
  }
  if (theTrip == []) throw "no trip found";

  let theActivity = [];
  let activityIndex;
  for (let y in theTrip.theActivities) {
    if (theTrip.theActivities[y]._id.toString() == activityid) {
      theActivity = theTrip.theActivities[y];
      activityIndex = y;
    }
  }
  if (theActivity == []) throw "no activity found";

  theActivity.info = info;
  theTrip.theActivities[activityIndex] = theActivity;
  user.trips[tripIndex] = theTrip;

  let updatedInfo = await userList.updateOne(
    { _id: ObjectId(userid) },
    { $set: user }
  );
  if (updatedInfo.modifiedCount === 0) throw "could not update book";

  return true;
};

const remove = async (userid, tripid, activityid) => {
  if (!userid) throw "must provide an id";
  if (typeof userid != "string" || userid.replace(/\s/g, "") == "")
    throw "userid must be a valid string";
  if (!userid.match(/^[0-9a-fA-F]{24}$/)) throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
  if (!tripid) throw "must provide an id";
  if (typeof tripid != "string" || tripid.replace(/\s/g, "") == "")
    throw "tripid must be a valid string";
  if (!tripid.match(/^[0-9a-fA-F]{24}$/)) throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
  if (!activityid) throw "must provide an id";
  if (typeof activityid != "string" || activityid.replace(/\s/g, "") == "")
    throw "activityid must be a valid string";
  if (!activityid.match(/^[0-9a-fA-F]{24}$/))
    throw "id must be a valid ObjectId"; //https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid

  let userList = await users();
  let user = await userList.findOne({ _id: ObjectId(userid) });
  if (user === null) throw "no user found";

  let theTrip = [];
  let tripIndex;
  for (let x in user.trips) {
    if (user.trips[x]._id.toString() == tripid) {
      theTrip = user.trips[x];
      tripIndex = x;
    }
  }
  if (theTrip == []) throw "no trip found";

  let theActivity = [];
  let activityIndex;
  for (let y in theTrip.theActivities) {
    if (theTrip.theActivities[y]._id.toString() == activityid) {
      theActivity = theTrip.theActivities[y];
      activityIndex = y;
    }
  }
  if (theActivity == []) throw "no activity found";

  theTrip.theActivities.splice(activityIndex, 1);
  if (theActivity.type == "flight") theTrip.flights--;
  else if (theActivity.type == "hotel_stay") theTrip.hotel_stays--;
  else theTrip.activities--;
  if (theTrip.flights < 0) theTrip.flights = 0;
  if (theTrip.hotel_stays < 0) theTrip.hotel_stays = 0;
  if (theTrip.activities < 0) theTrip.activities = 0;

  user.trips[tripIndex] = theTrip;

  let updatedInfo = await userList.updateOne(
    { _id: ObjectId(userid) },
    { $set: user }
  );
  if (updatedInfo.modifiedCount === 0) throw "could not update book";

  return true;
};

module.exports = {
  description: "Activities Functions",
  create,
  readAll,
  read,
  update,
  remove,
};
