import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useYear } from '../context/YearContext'
import { Popcorn } from 'lucide-react' // 👈 importa el icono

const TYPES = ['Película', 'Serie', 'Documental']

function Stars({ rating, onRate }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={star <= rating ? 'star active' : 'star'}
          onClick={() => onRate && onRate(star)}
        >
          ★
        </span>
      ))}
    </div>
  )
}

function Movies() {
  const { user } = useAuth()
  const { selectedYear } = useYear()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('Película')
  const [rating, setRating] = useState(5)
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])

  const fetchMovies = async () => {
    const { data } = await supabase
      .from('movies')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', `${selectedYear}-01-01`)
      .lte('date', `${selectedYear}-12-31`)
      .order('date', { ascending: false })
    setMovies(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchMovies() }, [selectedYear])

  const handleAdd = async () => {
    if (!title) return
    await supabase.from('movies').insert({
      user_id: user.id, title, type, rating, date
    })
    setTitle('')
    setRating(5)
    fetchMovies()
  }

  const handleDelete = async (id) => {
    await supabase.from('movies').delete().eq('id', id)
    fetchMovies()
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title-icon">
          <Popcorn size={28} /> Películas y Series  {/* 👈 icono en el título */}
        </h2>
        <p className="page-subtitle">{movies.length} registradas en {selectedYear}</p>
      </div>

      <div className="form-card">
        <h3>Añadir nueva</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-footer">
          <Stars rating={rating} onRate={setRating} />
          <button className="submit-btn" onClick={handleAdd} disabled={!title}>
            Añadir
          </button>
        </div>
      </div>

      {loading ? (
        <p className="empty">Cargando...</p>
      ) : movies.length === 0 ? (
        <p className="empty">No hay películas todavía. ¡Añade la primera!</p>
      ) : (
        <div className="items-list">
          {movies.map(movie => (
            <div key={movie.id} className="item-card">
              <div className="item-info">
                <span className="item-title">{movie.title}</span>
                <span className="item-meta">{movie.type} · {movie.date}</span>
                <Stars rating={movie.rating} />
              </div>
              <button className="delete-btn" onClick={() => handleDelete(movie.id)}>🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Movies