const mongoose = require('mongoose')

const Schema = mongoose.Schema

const dateShema = new Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  
})

module.exports = mongoose.model('date', dateShema)