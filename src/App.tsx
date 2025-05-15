import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/Credentials/LoginPage.tsx'
import RegisterPage from './pages/Credentials/RegisterPage.tsx'
import './index.css';
import "tailwindcss";
import ProtectedRoute from './Components/Auth/ProtectedRoutes.tsx';
import TripSearchPage from './pages/Users/TripSearchPage.tsx';
import TripBooking from './pages/Users/TripBooking.tsx';
import Bookings from './pages/Users/Bookings.tsx';
import BookingCancellation from './pages/Users/BookingCancellation.tsx';

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
