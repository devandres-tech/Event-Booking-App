const bcrypt = require('bcryptjs');
// Models
const Event = require('./models/event');
const User = require('./models/user');

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

// Get events by id
const events = (eventIds) => {
  return Event.find({ _id: { $in: eventIds } })
    .then(events => {
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          // call user function
          creator: user.bind(this, event.creator)
        };
      })
    })
    .catch(err => {
      throw err
    })
}

module.exports = {
  events: () => {
    return Event.find()
      .then((events) => {
        return events.map(event => {
          return {
            ...event._doc,
            creator: user.bind(this, event._doc.creator)
          }
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
      date: new Date(args.eventInput.date),
      creator: '5e26679d4518f9800c79f702'
    });
    let createdEvent;

    return event.save()
      .then((result) => {
        createdEvent = {
          ...result._doc,
          creator: user.bind(this, result._doc.creator)
        }
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
  },
  createUser: (args) => {
    // check for duplicate user
    return User.findOne({ email: args.userInput.email })
      .then(user => {
        if (user) {
          throw new Error('User already exists');
        }
        // return hashed password to store in database
        return bcrypt.hash(args.userInput.password, 12)
      })
      .then(hashedPassword => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword
        });
        return user.save();
      })
      .then(result => {
        return {
          ...result._doc,
          password: null
        }
      })
      .catch(err => {
        throw err
      })
  }
}