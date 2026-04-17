import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my')
      setBookings(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return
    try {
      await api.patch(`/bookings/${id}/cancel`)
      fetchBookings() // refresh
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel')
    }
  }

  useEffect(() => { fetchBookings() }, [])

  const statusColor = {
    pending:   'bg-yellow-100 text-yellow-600',
    confirmed: 'bg-green-100 text-green-600',
    cancelled: 'bg-red-100 text-red-500',
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">No bookings yet</p>
          <a href="/" className="text-rose-500 font-medium">Browse hotels →</a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b._id} className="bg-white rounded-2xl shadow-sm p-5 flex gap-4">
              <img
                src={b.listing?.photos?.[0] || 'https://via.placeholder.com/100'}
                alt={b.listing?.title}
                className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-800">{b.listing?.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[b.status]}`}>
                    {b.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1">📍 {b.listing?.city}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(b.checkIn).toDateString()} → {new Date(b.checkOut).toDateString()}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-rose-500 font-bold">₹{b.totalPrice.toLocaleString()}</span>
                  {b.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancel(b._id)}
                      className="text-sm text-red-400 hover:text-red-600 font-medium"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}