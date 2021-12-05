const trips = require('./trips');
const activities = require('./activities');
const profile = require('./profile');
let userData = require('../data/users');

const constructorMethod = (app) => {
  app.use('/trips', trips);
  app.use('/activities', activities);
  app.use('/profile', profile);

  app.get('/', async (req, res) => {
    if(!req.session.user) {
      const user = await userData.create("exampleuser", "yourpassword");
      if(user) {
          req.session.user = { username: "exampleuser", _id: user._id.toString() };
          let theTrips = user.trips;
          if(theTrips) req.session.user.trips = theTrips;
      }
    }
    res.redirect('trips');
    return;
  });

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;