import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Bookings, BookingResponse, TicketCancellationRequest, TicketCancellationResponse, BookingCancellationRequest, BookingCancellationResponse } from '../Types/Booking';
import fetch from 'cross-fetch';

export const bookingApiSlice = createApi({
  reducerPath: 'bookingApi', 
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5001/api/user',
    prepareHeaders: (headers, { }) => {
      const token = JSON.parse(localStorage.getItem('AuthToken') || '{}')?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    fetchFn: fetch, 
  }),
  endpoints: (builder) => ({
    getBookings: builder.query<Bookings, void>({
      query: () => '/bookings',
    }),
    getBookingById: builder.query<BookingResponse, string>({
      query: (bookingId) => `/bookings/${bookingId}`,
    }),

    cancelSeats: builder.mutation< TicketCancellationResponse, TicketCancellationRequest  >({
      query: ({bookingId, seat}) => ({
        url: `/tickets/${bookingId}`,
        method: 'DELETE',
        body: { 
            seatNumbers: [seat], 
        },
      }),
    }),

    cancelBooking: builder.mutation<BookingCancellationResponse, BookingCancellationRequest>({
        query: ({ bookingId }) => ({
            url: `/bookings/${bookingId}`,
            method: 'DELETE',
        }),
    }),
  })
});

export const { useGetBookingsQuery, useGetBookingByIdQuery, useCancelSeatsMutation, useCancelBookingMutation } = bookingApiSlice;
