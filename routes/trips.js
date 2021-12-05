const express = require('express');
const router = express.Router();
const tripData = require('../data/trips');

router.get('/', async (req, res) => {
    if(!req.session.user) {
        res.redirect('/');
        return;
    }
    let theTrips;
    if(!req.session.user) {
        res.redirect('/');
        return;
    }
    if(req.session.user.trips) {
        theTrips = req.session.user.trips;
    }
    else {
        res.redirect('/');
        return;
    }
    for(let trip in theTrips) {
        let start_date = new Date(theTrips[trip].startDate);
        let end_date = new Date(theTrips[trip].endDate);
        const monthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"];
        theTrips[trip].month = monthNames[start_date.getMonth()];
        theTrips[trip].start_day = start_date.getDate()+1; 
        theTrips[trip].end_day = end_date.getDate()+1 + " " + monthNames[end_date.getMonth()]; 
        theTrips[trip].year = end_date.getFullYear();
        theTrips[trip]._id = theTrips[trip]._id.toString();
    }
    res.render('trips', { title: "Trips", trips: theTrips, script: "trips" });
});

router.get('/add', async (req, res) => {
    if(!req.session.user) {
        res.redirect('/');
        return;
    }
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
    
    res.render('add_trip', { title: "Add Trip", today: `${todayYear}-${todayMonth}-${todayDay}`, tomorrow: `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}` });
});

router.get('/edit/:id', async (req, res) => {
    if(!req.session.user) {
        res.redirect('/');
        return;
    }
    let id = req.params.id;
    let theTrip = await tripData.read(req.session.user._id, id);
    let startYear = theTrip.startDate.getFullYear();
    let startMonth = theTrip.startDate.getMonth()+1;
    if(startMonth<10) startMonth = "0" + startMonth;
    let startDay = theTrip.startDate.getDate()+1;
    if(startDay<10) startDay = "0" + startDay;
    theTrip.startDate = startYear + "-" + startMonth + "-" + startDay;

    let endYear = theTrip.endDate.getFullYear();
    let endMonth = theTrip.endDate.getMonth()+1;
    if(endMonth<10) endMonth = "0" + endMonth;
    let endDay = theTrip.endDate.getDate()+1;
    if(endDay<10) endDay = "0" + endDay;
    theTrip.endDate = endYear + "-" + endMonth + "-" + endDay;

    let paramObject = { title: "Edit Trip", trip: theTrip };
    paramObject.id = id;

    res.render('edit_trip', paramObject);
});

router.post('/', async (req, res) => {
    try {
        let destination = req.body.destination;
        if(!destination) throw "Enter a value for destination";
        let start_date = new Date(req.body.start_date);
        let end_date = new Date(req.body.end_date);
        if(end_date < start_date) throw "End date must be after start date";
        let id = req.session.user._id;
        
        let newTrip = await tripData.create(id, destination, start_date, end_date);

        if(newTrip) {
            req.session.user.trips = await tripData.readAll(id);
            res.redirect('trips');
            return;
        }
        throw "Unable to add trip";
    } 
    catch (error) {
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
        
        res.render('add_trip', { title: "Add Trip", today: `${todayYear}-${todayMonth}-${todayDay}`, tomorrow: `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`, error: error });
    }
});

router.post('/edit/:id', async (req, res) => {
    let tripid = req.params.id;
    try {
        let destination = req.body.destination;
        if(!destination) throw "Enter a value for destination";
        let start_date = new Date(req.body.start_date);
        let end_date = new Date(req.body.end_date);
        if(end_date < start_date) throw "End date must be after start date";
        
        let newTrip = await tripData.update(req.session.user._id, tripid, destination, start_date, end_date);

        if(newTrip) {
            req.session.user.trips = await tripData.readAll(req.session.user._id);
            res.redirect('/trips');
            return;
        }
        throw "Unable to add trip";
    } 
    catch (error) {
        let theTrip = await tripData.read(req.session.user._id, tripid);
        let startYear = theTrip.startDate.getFullYear();
        let startMonth = theTrip.startDate.getMonth()+1;
        if(startMonth<10) startMonth = "0" + startMonth;
        let startDay = theTrip.startDate.getDate();
        if(startDay<10) startDay = "0" + startDay;
        theTrip.startDate = startYear + "-" + startMonth + "-" + startDay;

        let endYear = theTrip.endDate.getFullYear();
        let endMonth = theTrip.endDate.getMonth()+1;
        if(endMonth<10) endMonth = "0" + endMonth;
        let endDay = theTrip.endDate.getDate();
        if(endDay<10) endDay = "0" + endDay;
        theTrip.endDate = endYear + "-" + endMonth + "-" + endDay;

        let paramObject = { title: "Edit Trip", trip: theTrip };
        paramObject.id = tripid;
        paramObject.error = error;

        res.render('edit_trip', paramObject);
    }
});

router.post('/delete/:id', async (req, res) => {
    let tripid = req.params.id;
    try {    
        let deleted = await tripData.remove(req.session.user._id, tripid);

        if(deleted) {
            req.session.user.trips = await tripData.readAll(req.session.user._id);
            res.redirect('/trips');
            return;
        }
        throw "Unable to add trip";
    } 
    catch (error) {
        let theTrip = await tripData.read(req.session.user._id, tripid);
        let startYear = theTrip.startDate.getFullYear();
        let startMonth = theTrip.startDate.getMonth()+1;
        if(startMonth<10) startMonth = "0" + startMonth;
        let startDay = theTrip.startDate.getDate();
        if(startDay<10) startDay = "0" + startDay;
        theTrip.startDate = startYear + "-" + startMonth + "-" + startDay;

        let endYear = theTrip.endDate.getFullYear();
        let endMonth = theTrip.endDate.getMonth()+1;
        if(endMonth<10) endMonth = "0" + endMonth;
        let endDay = theTrip.endDate.getDate();
        if(endDay<10) endDay = "0" + endDay;
        theTrip.endDate = endYear + "-" + endMonth + "-" + endDay;

        let paramObject = { title: "Edit Trip", trip: theTrip };
        paramObject.id = tripid;
        paramObject.error = error;

        res.render('edit_trip', paramObject);
    }
});

module.exports = router;
