const mongoose = require('mongoose')

const Schema = mongoose.Schema

const doneSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  userId: {
    type: String,
    required: true
  }, 
  dateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'date',
    required: true
  },
  
}, {timestamps: true})

module.exports = mongoose.model('doneTasks', doneSchema)