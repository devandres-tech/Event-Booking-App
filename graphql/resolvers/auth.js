const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Models
const User = require('../../models/user');

module.exports = {
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
  },
  login: async ({ email, password }) => {
    // validate email, password
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User does not exist');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Invalid Credentials')
    }
    // validate token
    const token = await jwt.sign({ userId: user.id, email: user.email }, 'thesupersecretkey', {
      expiresIn: '1h'
    });
    return {
      userId: user.id,
      token: token,
      tokenExpiration: 1
    }
  }
}
