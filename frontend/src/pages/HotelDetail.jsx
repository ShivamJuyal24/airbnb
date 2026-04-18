import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function HotelDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState({ checkIn: '', checkOut: '', guests: 1 })
  const [message, setMessage] = useState({ text: '', type: '' })
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    api.get(`/listings/${id}`)
      .then(({ data }) => setHotel(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  const nights = booking.checkIn && booking.checkOut
    ? Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))
    : 0

  const handleBook = async () => {
    if (!user) return navigate('/login')
    if (nights <= 0) return setMessage({ text: 'Please select valid dates', type: 'error' })
    if (booking.guests < 1 || booking.guests > hotel.maxGuests)
      return setMessage({ text: `Guests must be between 1 and ${hotel.maxGuests}`, type: 'error' })

    setBookingLoading(true)
    setMessage({ text: '', type: '' })
    try {
      const { data } = await api.post('/payment/create-checkout-session', {
        listingId: id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
      })
      window.location.href = data.url // go to Stripe checkout
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Something went wrong', type: 'error' })
      setBookingLoading(false)
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>
  if (!hotel) return null

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="h-80 rounded-2xl overflow-hidden mb-6">
        <img src={hotel.photos[0]} alt={hotel.title} className="w-full h-full object-cover" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{hotel.title}</h1>
          <p className="text-gray-400 mb-4">📍 {hotel.city}, {hotel.country}</p>
          <p className="text-gray-600 leading-relaxed mb-6">{hotel.description}</p>
          <div className="flex gap-6 mb-6 text-sm text-gray-500">
            <span>👥 Up to {hotel.maxGuests} guests</span>
            <span>💰 ₹{hotel.pricePerNight.toLocaleString()} / night</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 h-fit">
          <p className="text-rose-500 font-bold text-xl mb-4">
            ₹{hotel.pricePerNight.toLocaleString()} <span className="text-gray-400 font-normal text-sm">/ night</span>
          </p>
          <div className="space-y-3 mb-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Check-in</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                value={booking.checkIn}
                onChange={e => setBooking({ ...booking, checkIn: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Check-out</label>
              <input
                type="date"
                min={booking.checkIn || new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                value={booking.checkOut}
                onChange={e => setBooking({ ...booking, checkOut: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Guests</label>
              <input
                type="number"
                min={1}
                max={hotel.maxGuests}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                value={booking.guests}
                onChange={e => setBooking({ ...booking, guests: Number(e.target.value) })}
              />
            </div>
          </div>

          {nights > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
              <div className="flex justify-between text-gray-500 mb-1">
                <span>₹{hotel.pricePerNight.toLocaleString()} × {nights} nights</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span>₹{(hotel.pricePerNight * nights).toLocaleString()}</span>
              </div>
            </div>
          )}

          {message.text && (
            <p className={`text-sm p-3 rounded-lg mb-3 ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
              {message.text}
            </p>
          )}

          <button
            onClick={handleBook}
            disabled={bookingLoading}
            className="w-full bg-rose-500 text-white py-3 rounded-lg font-medium hover:bg-rose-600 disabled:opacity-50"
          >
            {bookingLoading ? 'Redirecting to payment...' : user ? 'Book & Pay Now' : 'Login to Book'}
          </button>
        </div>
      </div>
    </div>
  )
}