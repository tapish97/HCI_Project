const users = require('./users');
const trips = require('./trips');
const activities = require('./activities');

const constructorMethod = (app) => {
    app.use('/users', users);
    app.use('/trips', trips);
    app.use('/activities', activities);
  
    app.use('*', (req, res) => {
      res.status(404).json({ error: 'Not found' });
    });
  };
  
  module.exports = constructorMethod;