import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useYear } from '../context/YearContext'

function StatCard({ emoji, label, value, to }) {
  const navigate = useNavigate()
  return (
    <div className="stat-card" onClick={() => navigate(to)}>
      <span className="stat-emoji">{emoji}</span>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

function Dashboard() {
  const { user } = useAuth()
  const { selectedYear } = useYear()
  const [stats, setStats] = useState({
    movies: 0, books: 0, workouts: 0, places: 0, moods: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      const tables = ['movies', 'books', 'workouts', 'places', 'moods', 'sunsets']
      const results = await Promise.all(
        tables.map(t => supabase
          .from(t)
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .gte('date', `${selectedYear}-01-01`)
          .lte('date', `${selectedYear}-12-31`)
        )
      )
      setStats({
        movies: results[0].count || 0,
        books: results[1].count || 0,
        workouts: results[2].count || 0,
        places: results[3].count || 0,
        moods: results[4].count || 0,
        sunsets: results[5].count || 0
      })
    }
    fetchStats()
  }, [selectedYear])

  return (
    <div className="page">
      <div className="page-header">
        <h2>🏠 Dashboard</h2>
        <p className="page-subtitle">Tu {selectedYear} en números</p>
      </div>
      <div className="stats-grid">
        <StatCard emoji="🎬" label="Películas y series" value={stats.movies} to="/peliculas" />
        <StatCard emoji="📚" label="Libros leídos" value={stats.books} to="/libros" />
        <StatCard emoji="🏋️" label="Entrenamientos" value={stats.workouts} to="/entrenamientos" />
        <StatCard emoji="🌍" label="Lugares visitados" value={stats.places} to="/lugares" />
        <StatCard emoji="💭" label="Estados de ánimo" value={stats.moods} to="/animo" />
        <StatCard emoji="🌅" label="Atardeceres vistos" value={stats.sunsets} to="/atardeceres" />
      </div>
    </div>
  )
}

export default Dashboard