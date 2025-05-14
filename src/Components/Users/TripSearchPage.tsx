import React, { useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import Header from "../Header"
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";

type Trip = {
  _id: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  busId: {
    _id: string;
    busNumber: string;
  };
  operatorId: {
    _id: string;
    name: string;
    email: string;
  };
};

type PaginationResponse = {
    data : {

        data: Trip[];
        total: number;
        currentPage: number;
        limit: number;
        totalPages: number;
    }
};

const TripSearchPage: React.FC = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  // const [startDate, setStartDate] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  });
  const [endDate, setEndDate] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const searchTrips = async (page = currentPage ) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        from,
        to,
        startDateTime: startDate,
        endDateTime: endDate,
        minPrice: minPrice || "0",
        maxPrice: maxPrice || "100000",
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await axios.get<PaginationResponse>(
        `http://localhost:5001/api/user/trips?${queryParams}`
      );

    const { data, total, currentPage: resPage, totalPages: resTotalPages, limit: resLimit } = response.data.data;
    
    setTrips(data);
    setTotalPages(resTotalPages);
    setTotalItems(total);
    setCurrentPage(resPage);
    console.log("Fetched trips:", data);
    console.log("Pagination data:", {
        totalPages: resTotalPages,
        totalItems: total,
        currentPage: resPage,
        limit: resLimit,
      });

    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

//   const formatDate = (isoString: string) =>
//     format(new Date(isoString), "dd MMM yyyy, hh:mm a");

  const calculateDuration = (departure: string, arrival: string) => {
    const departureTime = new Date(departure);
    const arrivalTime = new Date(arrival);
    const durationMs = arrivalTime.getTime() - departureTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Your Journey</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">From</label>
                <input
                  type="text"
                  placeholder="Departure city"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">To</label>
                <input
                  type="text"
                  placeholder="Destination city"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Departure Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Return Date (Optional)</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Min Price (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Max Price (₹)</label>
                <input
                  type="number"
                  placeholder="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={() => searchTrips()}
                className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </span>
                ) : "Search Trips"}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Available Trips</h2>
              
              <div className="flex items-center">
                <label className="text-sm text-gray-600 mr-2">Results per page:</label>
                <select 
                  value={limit} 
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    searchTrips(1);
                  }}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
            
            {trips.length === 0 && !loading && (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">No trips found. Try adjusting your search criteria.</p>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
                <div className="space-y-6">
                {trips.map((trip) => (
                  <div
                    key={trip._id}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row overflow-hidden hover:shadow-md transition duration-300"
                  >
                    {/* Left Section */}
                    <div className="w-full md:w-3/4 p-6 bg-gray-50 relative">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {trip.source} → {trip.destination}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {trip.operatorId?.name} • Bus #{trip.busId?.busNumber}
                          </p>
                        </div>
                        <div className="hidden md:block text-sm text-gray-500">
                          Seats left: <span className="font-medium">{trip.availableSeats}</span>
                        </div>
                      </div>
              
                      <div className="mt-6 flex justify-between items-center text-center">
                        {/* Departure */}
                        <div>
                          <p className="text-lg font-semibold text-gray-800">
                            {format(new Date(trip.departureTime), "hh:mm a")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(trip.departureTime), "dd MMM yyyy")}
                          </p>
                          <p className="text-sm mt-1">{trip.source}</p>
                        </div>
              
                        <div className="w-12 border-t border-dashed border-gray-400 mx-2"></div>
              
                        <div className="text-xs text-gray-500">
                          <p>{calculateDuration(trip.departureTime, trip.arrivalTime)}</p>
                        </div>
              
                        <div className="w-12 border-t border-dashed border-gray-400 mx-2"></div>
              
                        <div>
                          <p className="text-lg font-semibold text-gray-800">
                            {format(new Date(trip.arrivalTime), "hh:mm a")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(trip.arrivalTime), "dd MMM yyyy")}
                          </p>
                          <p className="text-sm mt-1">{trip.destination}</p>
                        </div>
                      </div>
                    </div>
              
                    <div className="w-full md:w-1/4 bg-white flex flex-col justify-between items-center p-6 border-t md:border-l md:border-t-0 border-gray-200">
                      <div className="text-center mb-4">
                        <p className="text-2xl font-bold text-blue-600">₹{trip.price}</p>
                        <p className="text-sm text-gray-500">{trip.availableSeats} seats left</p>
                      </div>
                      <button 
                        onClick={() => {
                          console.log(`Booking trip with ID: ${trip._id}`);
                          navigate(`/booking/${trip._id}`);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition transform hover:scale-105 w-full">
                          Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {trips.length > 0 && totalPages > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
                <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                  Showing {trips.length} of {totalItems} trips
                </div>
                
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => searchTrips(1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <span className="sr-only">First</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <button 
                    onClick={() => searchTrips(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => searchTrips(pageNum)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button 
                    onClick={() => searchTrips(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <button 
                    onClick={() => searchTrips(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <span className="sr-only">Last</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0zm6 0a1 1 0 010-1.414L14.586 10l-4.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TripSearchPage;