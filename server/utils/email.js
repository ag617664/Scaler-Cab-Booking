let nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service:'gmail',
  auth:{
      user:'abhishekg.8456@gmail.com',
      pass: process.env.PASS
  }
})

function sendCabBookingConfirmation(booking) {

  const mailOptions = {
    from:'abhishekg.8456@gmail.com',
    to: booking.email,
    subject: 'Cab Booking Confirmation',
    text: `Your cab is scheduled with following details:
      Estimated cost: ${booking.bookingPrice} INR
      Estimated time ${booking.estimatedTime} minutes
      Pickup location: ${booking.source}
      Drop location: ${booking.destination}
       `,
};

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Email error: ' + error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


module.exports = sendCabBookingConfirmation;