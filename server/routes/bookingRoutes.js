const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Cab = require("../models/Cab");
const calculateShortestTime = require("../utils/shortestPath");
const sendCabBookingConfirmation = require("../utils/email");

router.post("/addBooking", async (req, res) => {

  try {
    const { source, destination, email, cab, startTime } = req.body; 
  
    const cabName = await Cab.findOne({ name: cab.name });
    if (!cabName) {
        return res.status(404).json({ error: "Cab not found." });
    }

    const estimatedTime = await calculateShortestTime(source, destination);
    const bookingPrice = estimatedTime * cab?.price;
    const newBooking = new Booking({
      source,
      destination,
      email,
      cab: cab, 
      startTime,
      bookingPrice: bookingPrice,
      estimatedTime: estimatedTime,
      status: "In Progress",
    });

    const bookingStatus = await newBooking.save();

    const updatedBooking = await Cab.findByIdAndUpdate(cabName._id, {
      $set: {
        busyDuration: new Date(
          new Date().getTime() + (estimatedTime * 60000)   
        ),

      },
    });
    sendCabBookingConfirmation(newBooking);
    return res.status(200).json(newBooking);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create a new booking." });
  }
});

router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    console.log("backend here");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve bookings." });
  }
});

// GET /bookings/:id 
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve the booking." });
  }
});

// PUT /bookings/:id
router.put("/:id", async (req, res) => {
    try {
        const bookingId = req.params.id;
        const { source , destination,bookingPrice } = req.body;
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { $set: { source,
              destination,
              bookingPrice,
             } },

            { new: true }
        );
        res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: "Could not update the booking." });
  }
});



router.put("/status/:id",async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        $set: { status: "archived" },
      },
      { new: true }
    );

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: "Could not delete the booking." });
  }
});

router.delete("/permanent/:id", async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id); 
    res.status(200).json(deletedBooking);
  } catch (error) {
    res.status(500).json({ error: "Could not delete the booking." });
  }
}
);
module.exports = router;
