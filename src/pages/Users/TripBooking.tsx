import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../../Components/Header.tsx';
import Footer from '../../Components/Footer.tsx';
// import { useNavigate } from "react-router-dom";
import { Toaster , toast } from 'react-hot-toast';

interface Trip {
  _id: string;
  operatorId: string;
  busId: string;
  source: string;
  destination: string;
  arrivalTime: string;
  departureTime: string;
  price: number;
  totalSeats : number[];
  seatNumbers: number[];
  availableSeats: number;
  status: 'Scheduled' | 'Cancelled' | 'Completed';
}

interface Bus {
  _id: string;
  busNumber: string;
  busType: string;
  totalSeats: number;
}

const TripBooking: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [expired ,setExpired] = useState(false);
  const [unavailable , setUnavailable] = useState(false);
//   const navigate = useNavigate();

  useEffect(() => {
    if (!tripId) {
      setError('No trip ID provided');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const tripRes = await axios.get(`http://localhost:5001/api/user/trips/${tripId}`);
        const tripData = tripRes.data.data;
        setTrip(tripData);
        console.log(tripData.arrivalTime)
        console.log(tripData.seatNumbers.length)

        if (tripData.seatNumbers.length === 0) {
            setUnavailable(true);
        }
        
        const tripTime = new Date(tripData.arrivalTime);
        const now = new Date();

        if (tripTime < now) {
        console.log("Expired");
        setExpired(true);
        } else {
        console.log("Upcoming");
        }
        const busRes = await axios.get(`http://localhost:5001/api/user/buses/${tripData.busId}`);
        console.log(busRes.data.data);
        setBus(busRes.data.data);
        

        if (tripData.totalSeats && tripData.seatNumbers) {
            const bookedSeats = tripData.totalSeats.filter(
              (seat : Number) => !tripData.seatNumbers.includes(seat)
            );
            setBookedSeats(bookedSeats);
          }
          

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load trip details.');
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId]);

  const toggleSeatSelection = (seat: number) => {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats(prev => {
      const isSelected = prev.includes(seat);
      const updated = isSelected ? prev.filter(s => s !== seat) : [...prev, seat];
      setTotalPrice(updated.length * (trip?.price || 0));
      return updated;
    });
  };

  const renderSeats = () => {
    if (!trip) return null;
    const rows = [];
    const seatsPerRow = 4;
    const totalRows = Math.ceil(trip.totalSeats.length / seatsPerRow);

    for (let i = 0; i < totalRows; i++) {
      const row = [];
      for (let j = 0; j < seatsPerRow; j++) {
        const idx = i * seatsPerRow + j;
        if (j === 2) row.push(<div key={`aisle-${i}`} className="w-4" />);

        if (idx < trip.totalSeats.length) {
          const seat = trip.totalSeats[idx];
          const isBooked = bookedSeats.includes(seat);
          const isSelected = selectedSeats.includes(seat);

          row.push(
            <button
              key={`seat-${seat}`}
              onClick={() => toggleSeatSelection(seat)}
              disabled={isBooked}
              className={`w-12 h-12 m-1 rounded-md text-sm font-semibold
                ${isBooked ? 'bg-gray-400 cursor-not-allowed' : isSelected ? 'bg-blue-600 text-white' : 'bg-green-300 hover:bg-green-400'}`}
            >
              {seat}
            </button>
          );
        }
      }
      rows.push(
        <div key={`row-${i}`} className="flex justify-center items-center">
          {row}
        </div>
      );
    }

    return <div className="space-y-2">{rows}</div>;
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return alert('Select at least one seat');

    try {
        const token : any = localStorage.getItem('AuthToken');
        const parsed = JSON.parse(token);
        const parsedtoken = parsed.token;
        console.log(parsedtoken)
        if (window.confirm('Booking successful! Do you want to go to your bookings?')) {
            // navigate('/bookings');
            const respon = await axios.post(`http://localhost:5001/api/user/bookings/${tripId}`, {
                tripId: trip?._id,
                seatNumbers: selectedSeats,
                seats: selectedSeats.length,
                totalAmount: totalPrice
            },
            {
                headers: {
                    Authorization: `Bearer ${parsedtoken}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(respon.data);
            toast.success("Booking successful!");
            setBookedSeats((prev) => [...prev, ...selectedSeats]);

        } else {
            console.log('Booking cancelled');
        }
    } catch (err) {
      console.error(err);
      alert('Booking failed.');
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-600 text-center p-4">{error}</div>;
  if (!trip) return <div className="text-center">Trip not found</div>;

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  
    

  return (
    <>
    <Header />
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-2">{trip.source} → {trip.destination}</h2>
        <p className="text-gray-700">Departure: {formatDateTime(trip.departureTime)}</p>
        <p className="text-gray-700">Arrival: {formatDateTime(trip.arrivalTime)}</p>
        <p className="text-gray-700">Bus: {bus?.busNumber} ({bus?.busType})</p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Select Seats</h3>
        {renderSeats()}
      </div>
      {expired ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            <p className="font-semibold">This trip has expired.</p>
            </div>
        ) : (
        unavailable ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            <p className="font-semibold">No seats available.</p>
            </div>
        ) : (
        <div  className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
            <p>Seats: {selectedSeats.join(', ') || 'None selected'}</p>
            <p>Price: ₹{trip.price} × {selectedSeats.length} = ₹{totalPrice}</p>
            <button
            onClick={handleBooking}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
            Confirm Booking
            </button>
            
        </div>)
        )}

    </div>
    <Toaster position='top-right' />
    <Footer/>
    </>
  );
};

export default TripBooking;
