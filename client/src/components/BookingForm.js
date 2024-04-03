import React, { useEffect, useState } from "react";
import Cab from "./Cab";
import axios from "axios";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import image1 from "../assets/GivenGraph.png"


function BookingForm() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [availableCabs, setAvailableCabs] = useState([]);
  const [shortestTime, setShortestTime] = useState("");
  const [selectedCabId, setSelectedCabId] = useState("");
  const [showAvailableCabs, setShowAvailableCabs] = useState(false);
  const [cab, setCabData] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [startTime, setStartTime] = useState(new Date().getTime());

  const navigate = useNavigate();

  const isFirstFormValid = () => {
    return (
      userEmail.trim() !== "" &&
      source.trim() !== "" &&
      destination.trim() !== "" &&
      startTime !== "" &&
      source !== destination
    );
  };

  const fetchCabs = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_API_URL}/cabs/`)
        .then((response) => {
          const filteredCabs = response.data;
          setAvailableCabs(filteredCabs);
        });
    } catch (error) {
      console.log("Error fetching cabs:", error);
    }
  };

  const showAvailableCabsFunc = (event) => {
    event.preventDefault();
    if (isFirstFormValid()) {
      calculateShortestTimeEndPoint(source, destination);
      fetchCabs();
      if (source !== "" && destination !== "" && source === destination) {
        console.log("Source and Destination are same");
        setShowAvailableCabs(false);
      }
      setShowAvailableCabs(true);
    }
  };
  const handleCabSelection = (cab) => {
    setSelectedCabId(cab._id);
    setCabData(cab);
    setEstimatedPrice(shortestTime * cab?.price);
  };
  const calculateShortestTimeEndPoint = (source, destination) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/path/calculateShortestTime`, {
        params: {
          source,
          destination,
        },
      })
      .then((response) => {
        console.log(response.data);
        setShortestTime(response.data.shortestTime);
      })
      .catch((error) => {
        setErrorMessage("Error calculating shortest time");
        console.log("Error calculating shortest time", error);
        setShowAvailableCabs(false);
      });
  };
  let timeBooked;
  const handleSubmit = async (event) => {
    event.preventDefault();
    const bookingPrice = shortestTime * cab.price;

    timeBooked = Date.now() + shortestTime * 60000;
    localStorage.setItem("timeBooked", timeBooked);

    const bookingData = {
      email: userEmail,
      source,
      destination,
      cab,
      startTime,
      bookingPrice,
      estimatedTime: shortestTime,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/bookings/addBooking`,
        bookingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Booking created successfully", response.data);
      setConfirmationMessage("Booking created successfully!");
      setErrorMessage("");
      setUserEmail("");
      setSource("");
      setDestination("");
      setStartTime("");
      setSelectedCabId("");
      setEstimatedPrice("");
      setShowAvailableCabs(false);
      localStorage.setItem("cabBooked", true);
      toast.success("Booking created successfully!");
      let bookingId = response.data._id;
      navigate(`/yourBooking/${bookingId}`);
    } catch (error) {
      setErrorMessage(
        "Could not create the booking! Please try again after sometime!"
      );
      setConfirmationMessage("");
      console.log("Error creating booking", error);
    }
  };

  return (
    <div className="flex items-center justify-center flex-wrap">
    <div className="flex-3 pl-20">
        <img src={image1} alt="graph" className='h-[500px] w-[500px] object-contain'/>
      </div>
    <div className="max-w-lg mt-20 mx-auto p-6 bg-gray-300 rounded shadow-md">

        <h1 className="text-2xl font-semibold mb-4">Create Booking</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="userEmail"
              className="block text-md mb-2 font-medium text-gray-600"
            >
              User Email:
            </label>
            <input
              type="email"
              id="userEmail"
              className="w-full p-2 border rounded-md"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="source"
              className="block text-md mb-2 font-medium text-gray-600"
            >
              Select Source from the Dropdown-list
            </label>
            <select
              name="Source"
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="none" selected>
                Select a Source
              </option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            {/* <input
                        type="text"
                        id="source"
                        className="w-full p-2 border rounded-md"
                        value={source}
                        onChange={e => setSource(e.target.value)}
                        required
                    /> */}
          </div>
          <div className="mb-4">
            <label
              htmlFor="destination"
              className="block text-md mb-2 font-medium text-gray-600"
            >
              Select Destination from the Dropdown-list
            </label>
            <select
              name="Destination"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="none" selected>
                Select a Destination
              </option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            {/* <input
                        type="text"
                        id="destination"
                        className="w-full p-2 border rounded-md"
                        value={destination}
                        onChange={e => setDestination(e.target.value)}
                        required
                    /> */}
          </div>

          <button
            onClick={showAvailableCabsFunc}
            className={`${
              isFirstFormValid()
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            } rounded p-2 w-full font-semibold mb-4`}
            disabled={!isFirstFormValid()}
          >
            Show Available Cabs
          </button>

          <button
            onClick={() => {
              navigate("/allBookings");
            }}
            className="mt-2 rounded-md p-3 bg-red-500 text-white w-[29rem]"
          >
            All Bookings
          </button>

          {shortestTime &&
            shortestTime !== 0 &&
            source !== "" &&
            destination !== "" &&
            source !== destination && (
              <p className="text-lg font-semibold mb-4">
                Shortest Time: {shortestTime} minutes
              </p>
            )}

          {source !== "" && destination !== "" && source === destination && (
            <p className="text-lg font-semibold mb-4">
              {" "}
              Source and Destination are same!
            </p>
          )}

          {showAvailableCabs &&
            source !== "" &&
            destination !== "" &&
            source !== destination &&
            errorMessage === "" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Available Cabs</h2>
                <ul>
                  {availableCabs.length === 0 && (
                    <div>
                      <p>No cabs available right now.</p>
                      <p>Wait for a while.</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableCabs.map((cab) => (
                      <Cab
                        key={cab._id}
                        name={cab.name}
                        price={cab.price}
                        isActive={cab._id === selectedCabId}
                        onSelect={() => handleCabSelection(cab)}
                      />
                    ))}
                  </div>
                </ul>

                {estimatedPrice && estimatedPrice !== "" ? (
                  <p className="text-lg font-semibold mb-4">
                    Booking Price: {estimatedPrice} rupees
                  </p>
                ) : (
                  <></>
                )}

                <button
                  type="submit"
                  className={`${
                    localStorage.getItem("timeBooked") > Date.now()
                      ? "bg-gray-300 text-gray-600"
                      : "bg-blue-500 text-white disabled:opacity-70"
                  }
                            rounded p-2 w-full font-semibold mb-4`}
                  disabled={
                    !selectedCabId ||
                    localStorage.getItem("timeBooked") > Date.now()
                  }
                >
                  {`${
                    localStorage.getItem("timeBooked") > Date.now()
                      ? "You have already booked a cab. Check All Bookings!! "
                      : "Create Booking"
                  }`}
                </button>
              </div>
            )}
          {confirmationMessage && (
            <div className=" text-xl text-green-500 font-semibold mt-3">
              {confirmationMessage}
            </div>
          )}

          {errorMessage && (
            <div className="text-xl text-red-500 font-semibold mt-3">
              {errorMessage}
            </div>
          )}
        </form>
        </div>
    </div>
  );
}

export default BookingForm;
