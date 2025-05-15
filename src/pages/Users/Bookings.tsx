import React, { useEffect, useState, useRef } from 'react';
import Header from '../../Components/Header';
import html2pdf from 'html2pdf.js';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { useGetBookingsQuery } from '../../services/bookingsApiSlice';
import { Booking } from '../../Types/Booking';


const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const ticketRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const navigate = useNavigate();
  const { data } = useGetBookingsQuery();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log("DAta",data)
        console.log(data?.data)
        if (data!= undefined && data?.data) {
          setBookings(data.data); 
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
      }
    };

    fetchBookings();
  }, [data]);

  const handleDownload = (booking: Booking) => {
    const element = ticketRefs.current[booking._id];
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: `ticket_${booking._id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleCancel = async (bookingId: string) => {
        navigate(`/bookings/cancel/${bookingId}`);
    }

  const columns = [
    {
      name: 'Booking ID',
      selector: (row: Booking) => row._id,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Booked / Cancelled',
      selector: (row: Booking) =>
        [row.seatsBooked.join(','), row.seatsCancelled.join(',')].join(' / '),
      sortable: false,
    },
    {
      name: 'Total Price',
      selector: (row: Booking) => `₹${row.totalPrice}`,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row: Booking) => row.bookingStatus,
      sortable: true,
    },
    {
      name: 'Payment',
      selector: (row: Booking) => row.paymentStatus,
      sortable: true,
    },
    {
      name: 'Date',
      selector: (row: Booking) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
    },
    {
      name: 'Download',
      cell: (row: Booking) => (
        <button
          onClick={() => handleDownload(row)}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download
        </button>
      ),
    },
    {
        name: 'Cancel',
        cell: (row: Booking) => (
          <button
            onClick={() => handleCancel(row._id)}
            className={`px-3 py-1 rounded text-white ${
              row.bookingStatus === 'Cancelled' ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
            disabled={row.bookingStatus === 'Cancelled'}
          >
            Cancel
          </button>
        ),
      }
      
  ];

  return (
    <>
      <Header />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <DataTable
            columns={columns}
            data={bookings}
            pagination
            highlightOnHover
            responsive
            striped
          />
        )}

        <div className="absolute left-[-9999px] top-0">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              ref={(el:any) => (ticketRefs.current[booking._id] = el)}
              style={{
                width: '600px',
                padding: '20px',
                border: '1px solid #ccc',
                backgroundColor: 'white',
              }}
            >
              <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Booking Ticket</h2>
              <p><strong>Booking ID:</strong> {booking._id}</p>
              <p><strong>Seats:</strong> {[...booking.seatsBooked,"/", ...booking.seatsCancelled].join(', ')}</p>
              <p><strong>Total Price:</strong> ₹{booking.totalPrice}</p>
              <p><strong>Status:</strong> {booking.bookingStatus}</p>
              <p><strong>Payment:</strong> {booking.paymentStatus}</p>
              <p><strong>Booked On:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
              <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
                Thank you for booking with us!
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Bookings;
