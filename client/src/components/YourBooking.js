import { toast } from "react-hot-toast";
import React, {useState,useEffect} from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const YourBooking = () => {
    const navigate  = useNavigate();
    const { id } = useParams();
    const [bookingData, setBookingData] = useState(null);

    const editBooking = (id) => {
      navigate(`/edit-booking/${id}`);
    }

    useEffect(() => {

      const fetchData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/bookings/${id}`);

          if(response){
            setBookingData(response);
          }
        } catch (error) {
          console.error('Error fetching booking data:', error);
        }
      };
  
      fetchData(); 
    }, []); 

    const cabId = bookingData?.data.cab._id;
    const handleCancel = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/bookings/status/${id}`);
            console.log("Deleted Successfully",response);
            toast.success('Booking Cancelled Successfully'); 
            localStorage.setItem('timeBooked',0);
            const responseCab = await axios.put(`${process.env.REACT_APP_API_URL}/cabs/free/${cabId}`);
            console.log("Cab freee Successfully",responseCab);
            navigate('/');
        } catch (error) {
            console.error('Error cancelling booking:', error);
        }
    }
  return (
    <div>
        <br />
        <br />

      <div className="flex flex-col space-y-4">
        <div className=" p-20 max-w-x bg-gray-300 mx-auto rounded-lg shadow-md">
      <h1 className="text-2xl mb-6">Current Bookings</h1>
      <p className="text-2xl font-semibold text-red-700">{bookingData?.status==="archived" ? "Archived": ""} </p>
          {/* <h1 className="text-3xl font-semibold mb-6">Booking 1</h1> */}
          <div className="flex flex-col space-y-4">
            <p>User Email: {bookingData?.data.email}</p>
            <p>Source: {bookingData?.data.source}</p>
            <p>Destination: {bookingData?.data.destination}</p>
            <p>Booking Price: {bookingData?.data.bookingPrice}</p>
            <p>Status: {bookingData?.data.status}</p>
            <p>Estimated Time: {bookingData?.data.estimatedTime} minutes</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
      <button
        onClick={() => editBooking(id)}
        disabled={bookingData?.status === "archived"}
        className="bg-yellow-500 text-white rounded p-2 px-5  mt-6 mx-2 disabled:opacity-70"
      >
        Edit Booking
      </button>
      <button onClick={(handleCancel)}
        disabled={bookingData?.status === "archived"}
        className="mt-10 rounded-md p-4 bg-red-500 text-white disabled:opacity-70">
        Cancel Booking
      </button>
      <Link to="/allBookings">
      <button 
        className="mt-10 rounded-md p-4 bg-red-500 text-white">
        All Bookings
      </button>
      </Link>
      

      </div>

      
    </div>
    // <div>
    //     <h1>Your Booking!</h1>
    // </div>
  );
};

export default YourBooking;
