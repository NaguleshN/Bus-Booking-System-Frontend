// services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { loginRequest, registerRequest } from '../Types/AuthData';


export const myApi = createApi({
  reducerPath: 'myApi', 
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5001/api' ,
    credentials: 'include',
  }),

  endpoints: (builder) => ({
  
    login: builder.mutation({
      query: (credentials : loginRequest) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation({
      query: (newUser: registerRequest) => ({
        url: '/auth/register',
        method: 'POST',
        body: newUser,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

  }),

});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = myApi;
