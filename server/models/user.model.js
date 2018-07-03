const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = mongoose.Schema({
    name: {type: String, require: true},
    email: {
      type: String,
      require: [true, 'Email required'],
      unique: [true, 'Email already exits'],
      validate: {
        validator: function(email) {
          return /[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*/.test(email);
        },
        message: 'Email not valid'
      } 
    },
    password: {
        type: String,
        require: [true, 'Password required'],
        validate: {
          validator: function(password) {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/.test(password)
          },
          message: 'Password minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character'
        }
    },
    role: {type: String, default: 'user'},
    questions: [{type: Schema.Types.ObjectId, ref:'question'}],
    answers: [{type: Schema.Types.ObjectId, ref:'answer'}]
}, {
    timestamps: true
})

let user = mongoose.model('user', userSchema)

module.exports = user