import { React, useEffect } from "react";
import axios from "axios";

import { useNavigate ,Link} from "react-router-dom";


const Booking = ({ booking, onDeletePermanent }) => {
  const navigate = useNavigate();
  let id = booking._id;
  useEffect(() => {
    async function fetchData() {
        try {
            let time = localStorage.getItem('timeBooked');
            if (time < Date.now()) {
                await axios.put(`${process.env.REACT_APP_API_URL}/bookings/status/${id}`).then((res) => {
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
                })
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    fetchData();
}, []);
  
  return (
    <div className="mt-9 p-3 py-10 border border-gray-300 rounded-md shadow-md bg-white">
      <p className="text-2xl font-semibold text-red-700">{booking.status==="archived" ? "Archived": " "} </p>

      <p>
        <strong>User email:</strong> {booking.email}
      </p>
      <p>
        <strong>Pickup location:</strong> {booking.source}
      </p>
      <p>
        <strong>Drop location:</strong> {booking.destination}
      </p>
      <p>
        <strong>Estimated Time:</strong> {booking.estimatedTime} mins
      </p>
      <p>
        <strong>Booking Price:</strong> {booking.bookingPrice} rupees
      </p>
      <p>
        <strong>Cab name:</strong> {booking.cab.name}
      </p>
      <p>
        <strong> Status:</strong> {booking.status}
      </p>


      
      
      {
        booking.status === "archived" && (
          <button
            onClick={() => onDeletePermanent(booking._id)}
            className="bg-gray-600 text-white rounded p-2 mt-6 mx-2"
          >
            Delete Archived Booking
          </button>
        )
      }
      <Link to={`/yourBooking/${booking._id}`}>
      <button className="bg-blue-500 text-white rounded p-3 my-9 disabled:opacity-70"
      disabled={booking?.status === "archived"}
      >
        Update Booking
      </button>
      </Link>


    </div>
  );
};

export default Booking;
