import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useYear } from '../context/YearContext'

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

function Books() {
  const { user } = useAuth()
   const { selectedYear } = useYear()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [rating, setRating] = useState(5)
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])

  const fetchBooks = async () => {
    const { data } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', `${selectedYear}-01-01`)   // filtro por año
      .lte('date', `${selectedYear}-12-31`)
      .order('date', { ascending: false })
    setBooks(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchBooks() }, [selectedYear])

  const handleAdd = async () => {
    if (!title || !author) return
    await supabase.from('books').insert({
      user_id: user.id, title, author, rating, date
    })
    setTitle('')
    setAuthor('')
    setRating(5)
    fetchBooks()
  }

  const handleDelete = async (id) => {
    await supabase.from('books').delete().eq('id', id)
    fetchBooks()
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>📚 Libros</h2>
        <p className="page-subtitle">{books.length} leídos este año</p>
      </div>

      <div className="form-card">
        <h3>Añadir nuevo</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Autor"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-footer">
          <Stars rating={rating} onRate={setRating} />
          <button className="submit-btn" onClick={handleAdd} disabled={!title || !author}>
            Añadir
          </button>
        </div>
      </div>

      {loading ? (
        <p className="empty">Cargando...</p>
      ) : books.length === 0 ? (
        <p className="empty">No hay libros todavía. ¡Añade el primero!</p>
      ) : (
        <div className="items-list">
          {books.map(book => (
            <div key={book.id} className="item-card">
              <div className="item-info">
                <span className="item-title">{book.title}</span>
                <span className="item-meta">{book.author} · {book.date}</span>
                <Stars rating={book.rating} />
              </div>
              <button className="delete-btn" onClick={() => handleDelete(book.id)}>🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Books