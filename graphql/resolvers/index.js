const authResolver = require('./auth');
const eventsResolver = require('./event');
const bookingsResolver = require('./booking');

const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingsResolver
}

module.exports = rootResolver;
