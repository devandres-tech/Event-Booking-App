const bcrypt = require('bcryptjs');
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
}
