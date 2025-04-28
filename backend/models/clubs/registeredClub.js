const mongoose = require('mongoose');

const RegisteredClubSchema = new mongoose.Schema({
  ClubName: String,
  Clubusername: String,
  password: String,
  email: String,
  mobile: String,
  address: String,
  sportLevel: String,

},{ collection: 'clubusers' });

module.exports = mongoose.model('RegisteredClub', RegisteredClubSchema);
