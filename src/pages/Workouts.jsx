import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const TYPES = ['Fuerza', 'Cardio', 'Yoga', 'Natación', 'Ciclismo', 'Running', 'Otro']

function Workouts() {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('Fuerza')
  const [duration, setDuration] = useState('')
  const [calories, setCalories] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])

  const fetchWorkouts = async () => {
    const { data } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
    setWorkouts(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchWorkouts() }, [])

  const handleAdd = async () => {
    if (!duration) return
    await supabase.from('workouts').insert({
      user_id: user.id, type, duration: parseInt(duration),
      calories: calories ? parseInt(calories) : null, date
    })
    setDuration('')
    setCalories('')
    fetchWorkouts()
  }

  const handleDelete = async (id) => {
    await supabase.from('workouts').delete().eq('id', id)
    fetchWorkouts()
  }

  const totalMinutes = workouts.reduce((acc, w) => acc + w.duration, 0)

  return (
    <div className="page">
      <div className="page-header">
        <h2>🏋️ Entrenamientos</h2>
        <p className="page-subtitle">{workouts.length} entrenamientos · {totalMinutes} minutos en total</p>
      </div>

      <div className="form-card">
        <h3>Añadir nuevo</h3>
        <div className="form-row">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            type="number"
            placeholder="Duración (min)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="1"
          />
          <input
            type="number"
            placeholder="Calorías (opcional)"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            min="0"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-footer">
          <span />
          <button className="submit-btn" onClick={handleAdd} disabled={!duration}>
            Añadir
          </button>
        </div>
      </div>

      {loading ? (
        <p className="empty">Cargando...</p>
      ) : workouts.length === 0 ? (
        <p className="empty">No hay entrenamientos todavía. ¡Añade el primero!</p>
      ) : (
        <div className="items-list">
          {workouts.map(w => (
            <div key={w.id} className="item-card">
              <div className="item-info">
                <span className="item-title">{w.type}</span>
                <span className="item-meta">
                  {w.duration} min {w.calories ? `· ${w.calories} kcal` : ''} · {w.date}
                </span>
              </div>
              <button className="delete-btn" onClick={() => handleDelete(w.id)}>🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Workouts