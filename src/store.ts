import { configureStore } from '@reduxjs/toolkit';
import { myApi } from './services/loginApiSlice.js';
import { bookingApiSlice } from './services/bookingsApiSlice.js';

export const store = configureStore({
  reducer: {
    [myApi.reducerPath]: myApi.reducer,
    [bookingApiSlice.reducerPath]: bookingApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(myApi.middleware, bookingApiSlice.middleware)
});
