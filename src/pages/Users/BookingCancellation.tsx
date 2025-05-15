import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../../Components/Header';

interface Booking {
  _id: string;
  seatsBooked: number[];
  seatsCancelled: number[];
  totalPrice: number;
  bookingStatus: string;
  paymentStatus: string;
  createdAt: string;
}

const BookingCancellation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = JSON.parse(localStorage.getItem('AuthToken') || '{}')?.token;

  // Reusable fetch function
  const fetchBooking = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5001/api/user/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBooking(res.data.data || null);
      setError(null);
    } catch (err) {
      console.error('Error fetching booking:', err);
      setError('Unable to fetch booking details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId, token]);

  const cancelSeat = async (seat: number) => {
    try {
      await axios.delete(`http://localhost:5001/api/user/tickets/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          seatNumbers: [seat],
        },
      });

      fetchBooking();
    } catch (err) {
      console.error('Error cancelling seat:', err);
      setError('Failed to cancel seat. Please try again.');
    }
  };

  const cancelBooking = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/user/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      fetchBooking();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={fetchBooking}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Booking Not Found</h2>
              <p className="text-gray-600">This booking may have been cancelled or doesn't exist.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Booking Management</h2>
              <p className="text-blue-100 mt-1">Manage your reservation details</p>
            </div> */}
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Booking Reference</p>
                  <p className="font-mono text-gray-800 font-medium">{booking._id}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    booking.bookingStatus === 'Confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : booking.bookingStatus === 'Cancelled' 
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.bookingStatus}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p className={`font-medium ${
                    booking.paymentStatus === 'Paid' 
                      ? 'text-green-600' 
                      : booking.paymentStatus === 'Refunded' 
                      ? 'text-blue-600'
                      : 'text-red-600'
                  }`}>
                    {booking.paymentStatus}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="font-medium text-gray-800">${booking.totalPrice.toFixed(2)}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Booked On</p>
                  <p className="font-medium text-gray-800">{new Date(booking.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                  })}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Seat Management</h3>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Booked Seats</h4>
                  {booking.bookingStatus !== 'Cancelled' && booking.seatsBooked.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {booking.seatsBooked.map((seat) => (
                        <div key={seat} className="relative group">
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 flex items-center justify-center bg-blue-50 border border-blue-200 rounded text-blue-700 font-medium group-hover:border-red-300 transition-colors">
                              {seat}
                            </div>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to cancel seat ${seat}?`)) {
                                  cancelSeat(seat);
                                }
                              }}
                              className="mt-1 px-2 py-1 text-xs bg-transparent hover:bg-red-500 text-red-500 hover:text-white border border-red-300 hover:border-transparent rounded transition-all duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm italic text-gray-500">All seats are cancelled or booking is inactive.</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Cancelled Seats</h4>
                  {booking.seatsCancelled.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {booking.seatsCancelled.map((seat) => (
                        <div key={seat} className="w-12 h-12 flex items-center justify-center bg-gray-100 border border-gray-200 rounded text-gray-500 font-medium relative">
                          <span>{seat}</span>
                          <svg className="absolute -top-1 -right-1 h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm italic text-gray-500">No seats have been cancelled yet.</p>
                  )}
                </div>
              </div>
              
              {booking.bookingStatus !== 'Cancelled' && booking.seatsBooked.length > 0 && (
                <div className="border-t pt-4">
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">
                          Cancelling your entire booking will cancel all remaining seats. This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel the entire booking? This cannot be undone.')) {
                        cancelBooking();
                      }
                    }}
                    className="w-full flex justify-center items-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors"
                  >
                    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Cancel Entire Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingCancellation;