import { configureStore } from '@reduxjs/toolkit';
import { myApi } from './services/loginApiSlice';
import { bookingApiSlice } from './services/bookingsApiSlice';
import authSliceReducer from '../src/services/state/AuthSlice';

export const store = configureStore({
  reducer: {
    [myApi.reducerPath]: myApi.reducer,
    [bookingApiSlice.reducerPath]: bookingApiSlice.reducer,
    auth: authSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(myApi.middleware, bookingApiSlice.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;