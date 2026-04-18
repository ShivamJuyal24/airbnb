import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api/axios'

export default function BookingSuccess() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying') // verifying | success | error

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) return navigate('/')

    api.post('/payment/verify-and-book', { sessionId })
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [])

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-500">Confirming your booking...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-md w-full">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-6">Payment may have gone through but booking failed. Please contact support.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-rose-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-600"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-md w-full">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-500 mb-6">Your payment was successful. Enjoy your stay!</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/my-bookings')}
            className="bg-rose-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-600"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-100 text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-200"
          >
            Browse More
          </button>
        </div>
      </div>
    </div>
  )
}