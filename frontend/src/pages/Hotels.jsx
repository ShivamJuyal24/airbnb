import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function Hotels() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('')

  const fetchHotels = async (search = '') => {
    try {
      const { data } = await api.get(`/listings${search ? `?city=${search}` : ''}`)
      setHotels(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchHotels() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchHotels(city)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search bar */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Find your perfect stay</h1>
        <p className="text-gray-500 mb-6">Discover amazing hotels across India</p>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search by city..."
            className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            value={city}
            onChange={e => setCity(e.target.value)}
          />
          <button
            type="submit"
            className="bg-rose-500 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-rose-600"
          >
            Search
          </button>
          {city && (
            <button
              type="button"
              onClick={() => { setCity(''); fetchHotels('') }}
              className="bg-gray-100 text-gray-600 px-4 py-3 rounded-lg text-sm hover:bg-gray-200"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Hotels grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading hotels...</div>
      ) : hotels.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No hotels found in "{city}"</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map(hotel => (
            <Link to={`/hotels/${hotel._id}`} key={hotel._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden group">
              <div className="h-52 overflow-hidden">
                <img
                  src={hotel.photos[0] || 'https://via.placeholder.com/400x300'}
                  alt={hotel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-800 text-base leading-tight">{hotel.title}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-3">📍 {hotel.city}, {hotel.country}</p>
                <div className="flex items-center justify-between">
                <span className="text-rose-500 font-bold">
    ₹{hotel.pricePerNight?.toLocaleString?.() || 'N/A'}
    <span className="text-gray-400 font-normal text-sm"> /night</span>
  </span>

  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-rose-100 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition">
    →
  </span>
</div>
                
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}