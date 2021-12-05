const express = require('express');
const router = express.Router();
const tripData = require('../data/trips');
const activityData = require('../data/activities');

router.get('/:tripid', async (req, res) => {
    if(!req.session.user) {
        res.redirect('/');
        return;
    }
    let tripId = req.params.tripid;
    let theActivities = await activityData.readAll(req.session.user._id, tripId);
    let selectionDates = [];
    let selectionDatesExists = true;
    if(theActivities.length == 0 || theActivities == null) {
        selectionDatesExists = false;
    }
    for(let x in theActivities) {
        theActivities[x].id = theActivities[x]._id.toString();
        if(theActivities[x].type == "flight") {
            theActivities[x].flight = true;
            theActivities[x].info.depart_date_time = theActivities[x].info.departure_date + " " + theActivities[x].info.departure_time + " " + theActivities[x].info.departure_time_zone;
            theActivities[x].info.arrives_date_time = theActivities[x].info.arrival_date + " " + theActivities[x].info.arrival_time + " " + theActivities[x].info.arrival_time_zone; 
            let theDate = theActivities[x].info.departure_date.split('-');
            selectionDates.push(theDate[1] + "-" + theDate[2]);
        }
        if(theActivities[x].type == "hotel_stay") {
            theActivities[x].hotel_stay = true;
            let copyActivity = JSON.parse(JSON.stringify(theActivities[x]));
            copyActivity.info.start_date = null;
            theActivities.push(copyActivity);

            let theDate = theActivities[x].info.start_date.split('-');
            selectionDates.push(theDate[1] + "-" + theDate[2]);

            let theDate1 = theActivities[x].info.end_date.split('-');
            selectionDates.push(theDate1[1] + "-" + theDate1[2]);
        }
        if(theActivities[x].type == "tour_event") {
            theActivities[x].tour_event = true;

            let theDate = theActivities[x].info.start_date_time.split(' ')[0].split('-');
            selectionDates.push(theDate[1] + "-" + theDate[2]);
        }
        if(theActivities[x].type == "bus_boat") {
            theActivities[x].bus_boat = true;

            let theDate = theActivities[x].info.depart_date_time.split(' ')[0].split('-');
            selectionDates.push(theDate[1] + "-" + theDate[2]);
        }
    }
    selectionDates = [...new Set(selectionDates)];
    selectionDates.sort();
    let theTrip = await tripData.read(req.session.user._id, tripId); 
    theTrip.id = tripId;
    let start_date = new Date(theTrip.startDate);
    let end_date = new Date(theTrip.endDate);
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    theTrip.month = monthNames[start_date.getMonth()];
    theTrip.start_day = start_date.getDate()+1; 
    if(start_date.getMonth() == end_date.getMonth()) theTrip.end_day = end_date.getDate()+1;  
    else theTrip.end_day = monthNames[end_date.getMonth()] + " " + end_date.getDate()+1; 
    theTrip.year = end_date.getFullYear();
    res.render('activities', { title: "Activities", activities: theActivities, trip: theTrip, script: "activities", selection_date: selectionDates, selection_date_exists: selectionDatesExists });
}); 

router.get('/:tripid/:date', async (req, res) => {
    if(!req.session.user) {
        res.redirect('/');
        return;
    }
    let tripId = req.params.tripid;
    let theActivities = await activityData.readAll(req.session.user._id, tripId);
    let selectionDates = [];
    let selectionDatesExists = true;
    if(theActivities.length == 0 || theActivities == null) {
        selectionDatesExists = false;
    }
    for(let x in theActivities) {
        theActivities[x].id = theActivities[x]._id.toString();
        if(theActivities[x].type == "flight") {
            theActivities[x].flight = true;
            theActivities[x].info.depart_date_time = theActivities[x].info.departure_date + " " + theActivities[x].info.departure_time + " " + theActivities[x].info.departure_time_zone;
            theActivities[x].info.arrives_date_time = theActivities[x].info.arrival_date + " " + theActivities[x].info.arrival_time + " " + theActivities[x].info.arrival_time_zone; 
            let theDate = theActivities[x].info.departure_date.split('-');
            if(req.params.date.localeCompare(theDate[1] + "-" + theDate[2]) != 0) theActivities[x] = null;
            selectionDates.push(theDate[1] + "-" + theDate[2]);
        }
        else if(theActivities[x].type == "hotel_stay") {
            theActivities[x].hotel_stay = true;
            let copyActivity = JSON.parse(JSON.stringify(theActivities[x]));

            let theDate = theActivities[x].info.start_date.split('-');
            if(req.params.date.localeCompare(theDate[1] + "-" + theDate[2]) != 0) theActivities[x] = null;
            selectionDates.push(theDate[1] + "-" + theDate[2]);

            copyActivity.info.start_date = null;
            let theDate1 = copyActivity.info.end_date.split('-');
            if(req.params.date.localeCompare(theDate1[1] + "-" + theDate1[2]) == 0) {
                theActivities.push(copyActivity);
            }
            selectionDates.push(theDate1[1] + "-" + theDate1[2]);
        }
        else if(theActivities[x].type == "tour_event") {
            theActivities[x].tour_event = true;

            let theDate = theActivities[x].info.start_date_time.split(' ')[0].split('-');
            if(req.params.date.localeCompare(theDate[1] + "-" + theDate[2]) != 0) theActivities[x] = null;
            selectionDates.push(theDate[1] + "-" + theDate[2]);
        }
        else if(theActivities[x].type == "bus_boat") {
            theActivities[x].bus_boat = true;

            let theDate = theActivities[x].info.depart_date_time.split(' ')[0].split('-');
            if(req.params.date.localeCompare(theDate[1] + "-" + theDate[2]) != 0) theActivities[x] = null;
            selectionDates.push(theDate[1] + "-" + theDate[2]);
        }
    }
    selectionDates = [...new Set(selectionDates)];
    selectionDates.sort();
    theActivities = theActivities.filter(x => x !== null);
    let theTrip = await tripData.read(req.session.user._id, tripId); 
    theTrip.id = tripId;
    let start_date = new Date(theTrip.startDate);
    let end_date = new Date(theTrip.endDate);
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    theTrip.month = monthNames[start_date.getMonth()];
    theTrip.start_day = start_date.getDate()+1; 
    if(start_date.getMonth() == end_date.getMonth()) theTrip.end_day = end_date.getDate()+1;  
    else theTrip.end_day = monthNames[end_date.getMonth()] + " " + end_date.getDate()+1; 
    theTrip.year = end_date.getFullYear();
    res.render('activities', { title: "Activities", activities: theActivities, trip: theTrip, script: "activities", selection_date: selectionDates, selection_date_exists: selectionDatesExists });
}); 

router.get('/add/:tripid/:type', async (req, res) => {
    if(!req.session.user) {
        res.redirect('/');
        return;
    }
    //type = flight/hotel_stay/tour_event/bus_boat
    let tripid = req.params.tripid;
    let type = req.params.type;
    let paramObject = { title: "Add Activity" };
    paramObject.trip_id = tripid;
    if(type == "flight") paramObject.flight = true;
    if(type == "hotel_stay") paramObject.hotel_stay = true;
    if(type == "tour_event") paramObject.tour_event = true;
    if(type == "bus_boat") paramObject.bus_boat = true;

    let todayDate = new Date();
    let todayYear = "" + todayDate.getFullYear();
    let todayMonth = todayDate.getMonth() + 1;
    if(todayMonth < 10) todayMonth = "0" + todayMonth;
    let todayDay = todayDate.getDate();
    if(todayDay < 10) todayDay = "0" + todayDay;

    let tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    let tomorrowYear = "" + tomorrowDate.getFullYear();
    let tomorrowMonth = tomorrowDate.getMonth() + 1;
    if(tomorrowMonth < 10) tomorrowMonth = "0" + tomorrowMonth;
    let tomorrowDay = tomorrowDate.getDate();
    if(tomorrowDay < 10) tomorrowDay = "0" + tomorrowDay;

    paramObject.today = `${todayYear}-${todayMonth}-${todayDay}`;
    paramObject.tomorrow = `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`;

    res.render('add_activity', paramObject);
});

router.get('/edit/:tripid/:id', async (req, res) => {
    if(!req.session.user) {
        res.redirect('/');
        return;
    }
    let id = req.params.id;
    let tripid = req.params.tripid;

    let activity = await activityData.read(req.session.user._id, tripid, id);
    let info = activity.info;
    let paramObject = { title: "Edit Activity" };
    paramObject.id = id;
    paramObject.trip_id = tripid;

    if(activity.type == "flight") {
        paramObject.type = "flight";
        let pushActivity = {};
        pushActivity.flight = true;
        pushActivity.airline = info.airline;
        pushActivity.departure_date = info.departure_date;
        pushActivity.departure_airport = info.departure_airport;
        pushActivity.departure_time = info.departure_time;
        pushActivity.departure_time_zone = info.departure_time_zone;
        pushActivity.arrival_date = info.arrival_date;
        pushActivity.arrival_airport = info.arrival_airport;
        pushActivity.arrival_time = info.arrival_time;
        pushActivity.arrival_time_zone = info.arrival_time_zone;
        pushActivity.flight_number = info.flight_number;
        pushActivity.confirmation_number = info.confirmation_number;
        paramObject.flight = pushActivity;
    }
    else if(activity.type == "hotel_stay") {
        paramObject.type = "hotel_stay";
        let pushActivity = {};
        pushActivity.hotel_stay = true;
        pushActivity.hotel_name = info.hotel_name;
        pushActivity.start_date = info.start_date;
        pushActivity.end_date = info.end_date;
        pushActivity.address = info.address;
        pushActivity.confirmation_number = info.confirmation_number;
        paramObject.hotel_stay = pushActivity;
    }
    else if(activity.type == "tour_event") {
        paramObject.type = "tour_event";
        let pushActivity = {};
        pushActivity.tour_event = true;
        pushActivity.name = info.name;
        pushActivity.start_date = info.start_date_time.split(" ")[0];
        pushActivity.start_time = info.start_date_time.split(" ")[1];
        pushActivity.address = info.address;
        pushActivity.confirmation_number = info.confirmation_number;
        paramObject.tour_event = pushActivity;
    }
    else if(activity.type == "bus_boat") {
        paramObject.type = "bus_boat";
        let pushActivity = {};
        pushActivity.bus_boat = true;
        pushActivity.company = info.company;
        pushActivity.departure_date = info.depart_date_time.split(" ")[0];
        pushActivity.departure_time = info.depart_date_time.split(" ")[1];
        pushActivity.arrival_date = info.arrives_date_time.split(" ")[0];
        pushActivity.arrival_time = info.arrives_date_time.split(" ")[1];
        pushActivity.number = info.number;
        pushActivity.confirmation_number = info.confirmation_number;
        paramObject.bus_boat = pushActivity;
    }

    res.render('edit_activities', paramObject);
});

router.post('/:tripid/:type', async (req, res) => {
    try {
        let type = req.params.type;
        let tripid = req.params.tripid;
        if(type != "flight" && type != "hotel_stay" && type != "tour_event" && type != "bus_boat") throw "Invalid type";

        let created = false;
        let theInfo = {};
        if(type == "flight") {
            if(!req.body.departure_date || !req.body.departure_airport || !req.body.departure_time || !req.body.departure_time_zone || !req.body.arrival_date
                 || !req.body.arrival_airport || !req.body.arrival_time || !req.body.arrival_time_zone || !req.body.flight_number || !req.body.confirmation_number) throw "Please fill out all fields!";
            theInfo.departure_date = req.body.departure_date;
            theInfo.departure_airport = req.body.departure_airport;
            theInfo.departure_time = req.body.departure_time;
            theInfo.departure_time_zone = req.body.departure_time_zone;
            theInfo.arrival_date = req.body.arrival_date;
            theInfo.arrival_airport = req.body.arrival_airport;
            theInfo.arrival_time = req.body.arrival_time;
            theInfo.arrival_time_zone = req.body.arrival_time_zone;
            theInfo.flight_number = req.body.flight_number;
            theInfo.confirmation_number = req.body.confirmation_number;
            theInfo.airline = req.body.airline;
            theInfo.image_src = "/public/images/flight_icon.png";
            
            created = await activityData.create(req.session.user._id, tripid, "flight", theInfo);
        }
        else if(type == "hotel_stay") {
            if(!req.body.hotel_name || !req.body.start_date || !req.body.end_date || !req.body.address || !req.body.confirmation_number) throw "Please fill out all fields!";
            theInfo.hotel_name = req.body.hotel_name;
            theInfo.start_date = req.body.start_date;
            theInfo.end_date = req.body.end_date;
            theInfo.address = req.body.address;
            theInfo.confirmation_number = req.body.confirmation_number;
            theInfo.image_src = "/public/images/hotel_icon.png";

            created = await activityData.create(req.session.user._id, tripid, "hotel_stay", theInfo);
        }
        else if(type == "tour_event") {
            if(!req.body.name || !req.body.start_date || !req.body.start_time || !req.body.address || !req.body.confirmation_number) throw "Please fill out all fields!";
            theInfo.name = req.body.name;
            theInfo.start_date_time = req.body.start_date + " " + req.body.start_time;
            theInfo.address = req.body.address;
            theInfo.confirmation_number = req.body.confirmation_number;
            theInfo.image_src = "/public/images/compass_icon.png";

            created = await activityData.create(req.session.user._id, tripid, "tour_event", theInfo);
        }
        else if(type == "bus_boat") {
            if(!req.body.company || !req.body.departure_date || !req.body.departure_time || !req.body.arrival_date || !req.body.arrival_time ||
                 !req.body.number || !req.body.confirmation_number) throw "Please fill out all fields!";
            theInfo.company = req.body.company;
            theInfo.depart_date_time = req.body.departure_date + " " + req.body.departure_time;
            theInfo.arrives_date_time = req.body.arrival_date + " " + req.body.arrival_time;
            theInfo.number = req.body.number;
            theInfo.confirmation_number = req.body.confirmation_number;
            theInfo.image_src = "/public/images/bus_boat_icon.png";

            created = await activityData.create(req.session.user._id, tripid, "bus_boat", theInfo);
        }

        if(created) {
            res.redirect('/activities/' + tripid);
            return;
        }
        else throw "Could not create activity";
    }
    catch (error) {
        let paramObject = { title: "Add Activity" };
        let type = req.params.type;
        paramObject.trip_id = req.session.user._id;
        if(type == "flight") paramObject.flight = true;
        if(type == "hotel_stay") paramObject.hotel_stay = true;
        if(type == "tour_event") paramObject.tour_event = true;
        if(type == "bus_boat") paramObject.bus_boat = true;

        let todayDate = new Date();
        let todayYear = "" + todayDate.getFullYear();
        let todayMonth = todayDate.getMonth() + 1;
        if(todayMonth < 10) todayMonth = "0" + todayMonth;
        let todayDay = todayDate.getDate();
        if(todayDay < 10) todayDay = "0" + todayDay;

        let tomorrowDate = new Date(todayDate);
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        let tomorrowYear = "" + tomorrowDate.getFullYear();
        let tomorrowMonth = tomorrowDate.getMonth() + 1;
        if(tomorrowMonth < 10) tomorrowMonth = "0" + tomorrowMonth;
        let tomorrowDay = tomorrowDate.getDate();
        if(tomorrowDay < 10) tomorrowDay = "0" + tomorrowDay;

        paramObject.today = `${todayYear}-${todayMonth}-${todayDay}`;
        paramObject.tomorrow = `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`;
        paramObject.error = error;

        res.render('add_activity', paramObject)
    }
});

router.post('/edit/:tripid/:id/:type', async (req, res) => {
    let id = req.params.id;
    let tripid = req.params.tripid;
    let type = req.params.type;
    try {
        if(type != "flight" && type != "hotel_stay" && type != "tour_event" && type != "bus_boat") throw "Invalid type";

        let updated = false;
        let theInfo = {};
        if(type == "flight") {
            if(!req.body.departure_date || !req.body.departure_airport || !req.body.departure_time || !req.body.departure_time_zone || !req.body.arrival_date
                 || !req.body.arrival_airport || !req.body.arrival_time || !req.body.arrival_time_zone || !req.body.flight_number || !req.body.confirmation_number) throw "Please fill out all fields!";
            theInfo.departure_date = req.body.departure_date;
            theInfo.departure_airport = req.body.departure_airport;
            theInfo.departure_time = req.body.departure_time;
            theInfo.departure_time_zone = req.body.departure_time_zone;
            theInfo.arrival_date = req.body.arrival_date;
            theInfo.arrival_airport = req.body.arrival_airport;
            theInfo.arrival_time = req.body.arrival_time;
            theInfo.arrival_time_zone = req.body.arrival_time_zone;
            theInfo.flight_number = req.body.flight_number;
            theInfo.confirmation_number = req.body.confirmation_number;
            theInfo.airline = req.body.airline;
            theInfo.image_src = "/public/images/flight_icon.png";
            
            updated = await activityData.update(req.session.user._id, tripid, id, theInfo);
        }
        else if(type == "hotel_stay") {
            if(!req.body.hotel_name || !req.body.start_date || !req.body.end_date || !req.body.address || !req.body.confirmation_number) throw "Please fill out all fields!";
            theInfo.hotel_name = req.body.hotel_name;
            theInfo.start_date = req.body.start_date;
            theInfo.end_date = req.body.end_date;
            theInfo.address = req.body.address;
            theInfo.confirmation_number = req.body.confirmation_number;
            theInfo.image_src = "/public/images/hotel_icon.png";

            updated = await activityData.update(req.session.user._id, tripid, id, theInfo);
        }
        else if(type == "tour_event") {
            if(!req.body.name || !req.body.start_date || !req.body.start_time || !req.body.address || !req.body.confirmation_number) throw "Please fill out all fields!";
            theInfo.name = req.body.name;
            theInfo.start_date_time = req.body.start_date + " " + req.body.start_time;
            theInfo.address = req.body.address;
            theInfo.confirmation_number = req.body.confirmation_number;
            theInfo.image_src = "/public/images/compass_icon.png";

            updated = await activityData.update(req.session.user._id, tripid, id, theInfo);
        }
        else if(type == "bus_boat") {
            if(!req.body.company || !req.body.departure_date || !req.body.departure_time || !req.body.arrival_date || !req.body.arrival_time ||
                !req.body.number || !req.body.confirmation_number) throw "Please fill out all fields!";
            theInfo.company = req.body.company;
            theInfo.depart_date_time = req.body.departure_date + " " + req.body.departure_time;
            theInfo.arrives_date_time = req.body.arrival_date + " " + req.body.arrival_time;
            theInfo.number = req.body.number;
            theInfo.confirmation_number = req.body.confirmation_number;
            theInfo.image_src = "/public/images/bus_boat_icon.png";

            updated = await activityData.create(req.session.user._id, tripid, "bus_boat", theInfo);
        }

        if(updated) {
            res.redirect('/activities/' + tripid);
            return;
        }
        else throw "Could not create activity";
    } 
    catch (error) {
        let activity = await activityData.read(req.session.user._id, tripid, id);
        let info = activity.info;
        let paramObject = { title: "Edit Activity" };
        paramObject.id = id;
        paramObject.trip_id = tripid;

        if(activity.type == "flight") {
            paramObject.type = "flight";
            let pushActivity = {};
            pushActivity.flight = true;
            pushActivity.airline = info.airline;
            pushActivity.departure_date = info.departure_date;
            pushActivity.departure_airport = info.departure_airport;
            pushActivity.departure_time = info.departure_time;
            pushActivity.departure_time_zone = info.departure_time_zone;
            pushActivity.arrival_date = info.arrival_date;
            pushActivity.arrival_airport = info.arrival_airport;
            pushActivity.arrival_time = info.arrival_time;
            pushActivity.arrival_time_zone = info.arrival_time_zone;
            pushActivity.flight_number = info.flight_number;
            pushActivity.confirmation_number = info.confirmation_number;
            paramObject.flight = pushActivity;
        }
        else if(activity.type == "hotel_stay") {
            paramObject.type = "hotel_stay";
            let pushActivity = {};
            pushActivity.hotel_stay = true;
            pushActivity.hotel_name = info.hotel_name;
            pushActivity.start_date = info.start_date;
            pushActivity.end_date = info.end_date;
            pushActivity.address = info.address;
            pushActivity.confirmation_number = info.confirmation_number;
            paramObject.hotel_stay = pushActivity;
        }
        else if(activity.type == "tour_event") {
            paramObject.type = "tour_event";
            let pushActivity = {};
            pushActivity.tour_event = true;
            pushActivity.name = info.name;
            pushActivity.start_date = info.start_date_time.split(" ")[0];
            pushActivity.start_time = info.start_date_time.split(" ")[1];
            pushActivity.address = info.address;
            pushActivity.confirmation_number = info.confirmation_number;
            paramObject.tour_event = pushActivity;
        }
        else if(activity.type == "bus_boat") {
            paramObject.type = "bus_boat";
            let pushActivity = {};
            pushActivity.bus_boat = true;
            pushActivity.company = info.company;
            pushActivity.departure_date = info.depart_date_time.split(" ")[0];
            pushActivity.departure_time = info.depart_date_time.split(" ")[1];
            pushActivity.arrival_date = info.arrives_date_time.split(" ")[0];
            pushActivity.arrival_time = info.arrives_date_time.split(" ")[1];
            pushActivity.number = info.number;
            pushActivity.confirmation_number = info.confirmation_number;
            paramObject.bus_boat = pushActivity;
        }
        paramObject.error = error;
        res.render('edit_activities', paramObject);
    }
});

router.post('/delete/:tripid/:id', async (req, res) => {
    let id = req.params.id;
    let tripid = req.params.tripid;
    try {
        let deleted = await activityData.remove(req.session.user._id, tripid, id);
        if(deleted) {
            res.redirect(`/activities/${tripid}`);
            return;
        }
        else throw "Could not delete";
        
    } 
    catch (error) {
        let activity = await activityData.read(req.session.user._id, tripid, id);
        let info = activity.info;
        let paramObject = { title: "Edit Activity" };
        paramObject.id = id;
        paramObject.trip_id = tripid;

        if(activity.type == "flight") {
            paramObject.type = "flight";
            let pushActivity = {};
            pushActivity.flight = true;
            pushActivity.airline = info.airline;
            pushActivity.departure_date = info.departure_date;
            pushActivity.departure_airport = info.departure_airport;
            pushActivity.departure_time = info.departure_time;
            pushActivity.departure_time_zone = info.departure_time_zone;
            pushActivity.arrival_date = info.arrival_date;
            pushActivity.arrival_airport = info.arrival_airport;
            pushActivity.arrival_time = info.arrival_time;
            pushActivity.arrival_time_zone = info.arrival_time_zone;
            pushActivity.flight_number = info.flight_number;
            pushActivity.confirmation_number = info.confirmation_number;
            paramObject.flight = pushActivity;
        }
        else if(activity.type == "hotel_stay") {
            paramObject.type = "hotel_stay";
            let pushActivity = {};
            pushActivity.hotel_stay = true;
            pushActivity.hotel_name = info.hotel_name;
            pushActivity.start_date = info.start_date;
            pushActivity.end_date = info.end_date;
            pushActivity.address = info.address;
            pushActivity.confirmation_number = info.confirmation_number;
            paramObject.hotel_stay = pushActivity;
        }
        else if(activity.type == "tour_event") {
            paramObject.type = "tour_event";
            let pushActivity = {};
            pushActivity.tour_event = true;
            pushActivity.name = info.name;
            pushActivity.start_date = info.start_date_time.split(" ")[0];
            pushActivity.start_time = info.start_date_time.split(" ")[1];
            pushActivity.address = info.address;
            pushActivity.confirmation_number = info.confirmation_number;
            paramObject.tour_event = pushActivity;
        }
        else if(activity.type == "bus_boat") {
            paramObject.type = "bus_boat";
            let pushActivity = {};
            pushActivity.bus_boat = true;
            pushActivity.company = info.company;
            pushActivity.departure_date = info.depart_date_time.split(" ")[0];
            pushActivity.departure_time = info.depart_date_time.split(" ")[1];
            pushActivity.arrival_date = info.arrives_date_time.split(" ")[0];
            pushActivity.arrival_time = info.arrives_date_time.split(" ")[1];
            pushActivity.number = info.number;
            pushActivity.confirmation_number = info.confirmation_number;
            paramObject.bus_boat = pushActivity;
        }
        paramObject.error = error;
        res.render('edit_activities', paramObject);
    }
});

module.exports = router;