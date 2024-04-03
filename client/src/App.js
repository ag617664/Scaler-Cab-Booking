import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import BookingForm from './components/BookingForm';
import AllBookings from './components/AllBookings';
import EditBookingPage from './components/EditBookingPage'; 
import YourBooking from './components/YourBooking';
import './App.css';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/yourBooking/:id" element={<YourBooking/>} />
          <Route path="/allBookings" element={<AllBookings/>} />
          <Route path="/edit-booking/:bookingId" element={<EditBookingPage/>} />
          <Route path="/" element={<BookingForm/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
