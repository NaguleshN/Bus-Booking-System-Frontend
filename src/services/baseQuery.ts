import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const BookingApiSlice = createApi({
    reducerPath : "posts",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5001/api/user"
    }),
    endpoints : (builder) =>{
        return {
            getBookings: builder.query({
                query : () => "/bookings"
            })
        }
    }
})