// models/sportPeople/Person.js
const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  profilePic: {
    type: String, // Store image URL or file path
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
