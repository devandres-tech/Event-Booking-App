const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// Models
const Event = require('./models/event');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

// Graphql config
app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type User {
      _Id: ID!
      email: String!
      password: String
    }

    input UserInput {
      email: String!
      password: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return Event.find()
        .then((events) => {
          return events.map(event => {
            return {
              ...event._doc
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
            ...result._doc
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
  },
  graphiql: true
}));

// connect to database
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-3lj5r.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
  .then(() => {
    app.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
  })
  .catch((err) => {
    console.log("failed connection", err);
  });
