// routes/sportPeople/personRoutes.js
const express = require('express');
const router = express.Router();
const Person = require('../../models/sportPeople/Person'); // Notice the path!

// Get all persons
router.get('/', async (req, res) => {
  try {
    const persons = await Person.find();
    res.json(persons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single person by ID
router.get('/:id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }
    res.json(person);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new person
router.post('/', async (req, res) => {
  const { name, address, email, phone, description, profilePic } = req.body;
  const newPerson = new Person({ name, address, email, phone, description, profilePic });

  try {
    const savedPerson = await newPerson.save();
    res.status(201).json(savedPerson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
