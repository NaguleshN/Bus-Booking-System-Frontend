import { createSlice } from "@reduxjs/toolkit";
import { loginResponse, registerRequest } from "../../Types/AuthData";
import { RootState } from "../../store";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    loginRequest: (state) => {  
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {  
        console.log(action.payload.user)
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {    
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setUser: (state, action:{payload: any}) => {   
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    }
  }
});

export default authSlice.reducer;
export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
  setToken
} = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectLoading = (state: RootState) => state.auth.loading;
export const selectError = (state: RootState) => state.auth.error;     