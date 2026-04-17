import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-rose-500 font-bold text-2xl">🏨 StayEase</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-600 text-sm">Hi, {user.name}</span>
              <Link to="/my-bookings" className="text-gray-700 hover:text-rose-500 text-sm font-medium">
                My Bookings
              </Link>
              <button
                onClick={handleLogout}
                className="bg-rose-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-rose-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-rose-500 text-sm font-medium">
                Login
              </Link>
              <Link to="/register" className="bg-rose-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-rose-600">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}