import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './Components/Credentials/LoginPage.tsx'
import RegisterPage from './Components/Credentials/RegisterPage.tsx'
import './index.css';
import "tailwindcss";
import ProtectedRoute from './Components/Auth/ProtectedRoutes.tsx';
import TripSearchPage from './Components/Users/TripSearchPage.tsx';
import TripBooking from './Components/Users/TripBooking.tsx';
import Bookings from './Components/Users/Bookings.tsx';
import BookingCancellation from './Components/Users/BookingCancellation.tsx';

function App() {

  return (
    <Router>
      <Routes>

        <Route element={<ProtectedRoute allowedRoles={["user"]} />} >
          <Route path='' element={ <TripSearchPage /> } ></Route>
          <Route path='/booking/:tripId' element={ <TripBooking /> } ></Route>
          <Route path='/bookings/cancel/:bookingId' element={ <BookingCancellation /> } ></Route>
          <Route path='/bookings' element={ <Bookings /> } ></Route>
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

      </Routes>
    </Router>
  )
}

export default App
