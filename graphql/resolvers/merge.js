// Models
const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../utils/date');

// Get user by Id
const user = (userId) => {
  return User.findById(userId)
    .then(user => {
      return {
        ...user._doc,
        _id: user.id,
        createdEvents: events.bind(this, user._doc.createdEvents)
      }
    })
    .catch(err => {
      throw err;
    })
}

// get a single event by Id
const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (err) {
    throw err;
  }
}

// Get events by id
const events = (eventIds) => {
  return Event.find({ _id: { $in: eventIds } })
    .then(events => {
      return events.map(event => {
        return transformEvent(event);
      })
    })
    .catch(err => {
      throw err
    })
}

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    creator: user.bind(this, event.creator),
    date: dateToString(event._doc.date)
  };
}

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  }
}

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
