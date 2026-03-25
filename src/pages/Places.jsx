import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useYear } from '../context/YearContext'

function Places() {
  const { user } = useAuth()
   const { selectedYear } = useYear()
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])

  const fetchPlaces = async () => {
    const { data } = await supabase
      .from('places')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', `${selectedYear}-01-01`)   // filtro por año
      .lte('date', `${selectedYear}-12-31`)
      .order('date', { ascending: false })
    setPlaces(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchPlaces() }, [selectedYear])

  const handleAdd = async () => {
    if (!city || !country) return
    await supabase.from('places').insert({
      user_id: user.id, city, country, date
    })
    setCity('')
    setCountry('')
    fetchPlaces()
  }

  const handleDelete = async (id) => {
    await supabase.from('places').delete().eq('id', id)
    fetchPlaces()
  }

  const countries = [...new Set(places.map(p => p.country))]

  return (
    <div className="page">
      <div className="page-header">
        <h2>🌍 Lugares</h2>
        <p className="page-subtitle">{places.length} ciudades · {countries.length} países</p>
      </div>

      <div className="form-card">
        <h3>Añadir nuevo</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Ciudad"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="text"
            placeholder="País"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-footer">
          <span />
          <button className="submit-btn" onClick={handleAdd} disabled={!city || !country}>
            Añadir
          </button>
        </div>
      </div>

      {loading ? (
        <p className="empty">Cargando...</p>
      ) : places.length === 0 ? (
        <p className="empty">No hay lugares todavía. ¡Añade el primero!</p>
      ) : (
        <div className="items-list">
          {places.map(p => (
            <div key={p.id} className="item-card">
              <div className="item-info">
                <span className="item-title">{p.city}</span>
                <span className="item-meta">{p.country} · {p.date}</span>
              </div>
              <button className="delete-btn" onClick={() => handleDelete(p.id)}>🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Places