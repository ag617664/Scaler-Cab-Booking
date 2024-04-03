const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  source: String,
  destination: String,
  email: String,
  cab: { type: Object },
  startTime: {
    type: Date,
    default: Date.now(), 
  },
  bookingPrice: Number,
  estimatedTime: Number,
  status: {
    type: String,
    enum :['In Progress','archived'],
  }
  
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
