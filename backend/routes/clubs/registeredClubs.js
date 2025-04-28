const express = require('express');
const router = express.Router();
const RegisteredClub = require('../../models/club/registeredClub');

// GET /api/registered-clubs
router.get('/', async (req, res) => {
  try {
    const clubs = await RegisteredClub.find({ sportLevel: 'Clubs' });
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registered clubs', error });
  }
});

module.exports = router;
