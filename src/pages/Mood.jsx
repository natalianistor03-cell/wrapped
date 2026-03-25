import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useYear } from '../context/YearContext'

const EMOJIS = ['😄', '😊', '😐', '😔', '😢', '😤', '😴', '🤩', '😰', '🥰']

function Mood() {
  const { user } = useAuth()
  const { selectedYear } = useYear()
  const [moods, setMoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [emoji, setEmoji] = useState('😊')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])

  const fetchMoods = async () => {
    const { data } = await supabase
      .from('moods')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', `${selectedYear}-01-01`)   // filtro por año
      .lte('date', `${selectedYear}-12-31`)
      .order('date', { ascending: false })
    setMoods(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchMoods() }, [selectedYear])

  const handleAdd = async () => {
    await supabase.from('moods').insert({
      user_id: user.id, emoji, note, date
    })
    setNote('')
    fetchMoods()
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>💭 Estado de ánimo</h2>
        <p className="page-subtitle">{moods.length} registros este año</p>
      </div>

      <div className="form-card">
        <h3>¿Cómo te sientes hoy?</h3>
        <div className="emoji-picker">
          {EMOJIS.map(e => (
            <span
              key={e}
              className={emoji === e ? 'emoji-option active' : 'emoji-option'}
              onClick={() => setEmoji(e)}
            >
              {e}
            </span>
          ))}
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Nota (opcional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-footer">
          <span />
          <button className="submit-btn" onClick={handleAdd}>
            Añadir
          </button>
        </div>
      </div>

      {loading ? (
        <p className="empty">Cargando...</p>
      ) : moods.length === 0 ? (
        <p className="empty">No hay registros todavía. ¡Añade el primero!</p>
      ) : (
        <div className="items-list">
          {moods.map(m => (
            <div key={m.id} className="item-card">
              <div className="item-info">
                <span className="item-title">{m.emoji} {m.note || 'Sin nota'}</span>
                <span className="item-meta">{m.date}</span>
              </div>
              <button className="delete-btn" onClick={async () => {
                await supabase.from('moods').delete().eq('id', m.id)
                fetchMoods()
              }}>🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Mood