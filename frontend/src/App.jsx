import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hotels from './pages/Hotels'
import HotelDetail from './pages/HotelDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import MyBookings from './pages/MyBookings'
import { useAuth } from './context/AuthContext'
import BookingSuccess from './pages/BookingSuccess'
const PrivateRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/"            element={<Hotels />} />
        <Route path="/hotels/:id"  element={<HotelDetail />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
        <Route path="/booking-success" element={<BookingSuccess />} />
      </Routes>
    </div>
  )
}