const mongoose = require('mongoose')
const date = require("../models/dateModel")

const Schema = mongoose.Schema

const todoSchema = new Schema({
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

module.exports = mongoose.model('Todo', todoSchema)