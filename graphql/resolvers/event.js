// Models
const Event = require('../../models/event');
// Utils
const { dateToString } = require('../../utils/date')
const { transformEvent } = require('./merge')

module.exports = {
  events: () => {
    return Event.find()
      .then((events) => {
        return events.map(event => {
          return transformEvent(event);
        })
      })
      .catch((err) => {
        console.log('Failed to retrieve from events', err)
      })
  },
  createEvent: (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: dateToString(args.eventInput.date),
      creator: '5e26679d4518f9800c79f702'
    });
    let createdEvent;

    return event.save()
      .then((result) => {
        createdEvent = transformEvent(result);
        return User.findById('5e26679d4518f9800c79f702')
      })
      .then(user => {
        if (!user) {
          throw new Error('User not found');
        }
        user.createdEvents.push(event);
        return user.save();
      })
      .then(result => {
        return createdEvent;
      })
      .catch((err) => {
        console.log('Failed to write to database', err);
        throw err;
      });
  }
}

