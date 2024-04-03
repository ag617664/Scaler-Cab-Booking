import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Booking from './Booking';
import { useNavigate } from 'react-router';
import axios from 'axios';
import toast from 'react-hot-toast';

function BookingList() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);

    
    useEffect(() => {
        async function fetchBookings() {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/bookings`);
                if (!response.statusText) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.data;
                setBookings(data);
            } catch (error) {
                console.log('Error fetching data:', { error: error.message });
            }
        }
        fetchBookings();
    }, []);
    
    const handleEditBooking = (bookingId) => {
        navigate(`/edit-booking/${bookingId}`);
    };

    const handleDeleteBooking = (bookingId) => {

        axios.delete(`${process.env.REACT_APP_API_URL}/bookings/${bookingId}`)
            .then(() => {
                console.log('Booking successfully deleted!');
                setBookings((prevBookings) =>
                    prevBookings.filter((booking) => booking._id !== bookingId)
                );
            })
            .catch((error) => {
                console.log('Error deleting booking', error);
            });

            toast.success('Booking archived successfully!');
    };

    const handlePermanentDeleteBooking = (bookingId) => {
        axios.delete(`${process.env.REACT_APP_API_URL}/bookings/permanent/${bookingId}`)
      .then(() => {
        console.log('Booking successfully deleted!');
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== bookingId)
        );
      })
      .catch((error) => {
        console.log('Error deleting booking', error);
      });
      toast.success('Booking deleted successfully!');
    }

    return (
        <div className="max-w-5xl flex flex-col mt-16 mb-16 mx-auto p-6 bg-transparent rounded shadow-md">
            <h1 className="text-3xl font-semibold mb-4 text-white">All Bookings</h1>
            
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    {bookings.map((booking) => (
                        <Booking
                            key={booking._id}
                            booking={booking}
                            onEdit={handleEditBooking}
                            onDelete={handleDeleteBooking}
                            onDeletePermanent={handlePermanentDeleteBooking}
                        />
                        
                    ))}
                    
                    
                </div>


                    <div>
                        <Link to="/">
                        <button className="bg-blue-500 text-white rounded p-3 my-9">
                                Add Booking
                    </button>
                            
                        </Link>
                    </div>
                
        </div>
    )
}

export default BookingList;
