const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  firstName: {
    type: String,
    required: false
  }, 
  lastName: {
    type: String,
    required: false
  },
  birthday: {
    type: Date,
    require: false
  },
  img: {
    type: Buffer,
    required: false
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'files'
  }
  
})

module.exports = mongoose.model('user', userSchema)