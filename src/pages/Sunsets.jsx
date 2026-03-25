import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useYear } from '../context/YearContext'

function Sunsets() {
  const { user } = useAuth()
  const { selectedYear } = useYear()
  const [sunsets, setSunsets] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [location, setLocation] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)

  const fetchSunsets = async () => {
    const { data } = await supabase
      .from('sunsets')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', `${selectedYear}-01-01`)
      .lte('date', `${selectedYear}-12-31`)
      .order('date', { ascending: false })
    setSunsets(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchSunsets() }, [selectedYear])

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleAdd = async () => {
    setUploading(true)
    let photo_url = null

    if (photo) {
      const ext = photo.name.split('.').pop()
      const path = `${user.id}/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('sunsets').upload(path, photo)
      if (!error) {
        const { data } = supabase.storage.from('sunsets').getPublicUrl(path)
        photo_url = data.publicUrl
      }
    }

    await supabase.from('sunsets').insert({
      user_id: user.id, location, note, photo_url, date
    })

    setLocation('')
    setNote('')
    setPhoto(null)
    setPreview(null)
    setUploading(false)
    fetchSunsets()
  }

  const handleDelete = async (id, photo_url) => {
    if (photo_url) {
      const path = photo_url.split('/sunsets/')[1]
      await supabase.storage.from('sunsets').remove([path])
    }
    await supabase.from('sunsets').delete().eq('id', id)
    fetchSunsets()
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>🌅 Atardeceres</h2>
        <p className="page-subtitle">{sunsets.length} atardeceres este año</p>
      </div>

      <div className="form-card">
        <h3>Añadir nuevo</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Lugar (opcional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
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

        <div className="photo-upload">
          <label className="photo-label" htmlFor="photo-input">
            {preview ? (
              <img src={preview} alt="preview" className="photo-preview" />
            ) : (
              <div className="photo-placeholder">
                <span>📷</span>
                <span>Añadir foto</span>
              </div>
            )}
          </label>
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            style={{ display: 'none' }}
          />
        </div>

        <div className="form-footer">
          <span />
          <button className="submit-btn" onClick={handleAdd} disabled={uploading}>
            {uploading ? 'Subiendo...' : 'Añadir'}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="empty">Cargando...</p>
      ) : sunsets.length === 0 ? (
        <p className="empty">No hay atardeceres todavía. ¡Añade el primero!</p>
      ) : (
        <div className="sunsets-grid">
          {sunsets.map(s => (
            <div key={s.id} className="sunset-card">
              {s.photo_url ? (
                <img src={s.photo_url} alt={s.location} className="sunset-photo" />
              ) : (
                <div className="sunset-no-photo">🌅</div>
              )}
              <div className="sunset-info">
                <span className="sunset-location">{s.location || 'Sin ubicación'}</span>
                <span className="sunset-meta">{s.date}{s.note ? ` · ${s.note}` : ''}</span>
              </div>
              <button className="delete-btn sunset-delete" onClick={() => handleDelete(s.id, s.photo_url)}>🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Sunsets