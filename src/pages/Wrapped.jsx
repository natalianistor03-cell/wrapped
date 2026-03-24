import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function Slide({ children, gradient }) {
  return (
    <motion.div
      className="wrapped-slide"
      style={{ background: gradient }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

function Wrapped() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [slide, setSlide] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const fetchAll = async () => {
      const [movies, books, workouts, places, moods] = await Promise.all([
        supabase.from('movies').select('*').eq('user_id', user.id),
        supabase.from('books').select('*').eq('user_id', user.id),
        supabase.from('workouts').select('*').eq('user_id', user.id),
        supabase.from('places').select('*').eq('user_id', user.id),
        supabase.from('moods').select('*').eq('user_id', user.id),
      ])
      setData({
        movies: movies.data || [],
        books: books.data || [],
        workouts: workouts.data || [],
        places: places.data || [],
        moods: moods.data || []
      })
      setLoading(false)
    }
    fetchAll()
  }, [])

  if (loading) return <p className="empty">Cargando tu Wrapped...</p>

  // Calcular stats
  const topMovie = data.movies.sort((a, b) => b.rating - a.rating)[0]
  const topBook = data.books.sort((a, b) => b.rating - a.rating)[0]
  const totalMinutes = data.workouts.reduce((acc, w) => acc + w.duration, 0)
  const topWorkout = data.workouts.reduce((acc, w) => {
    acc[w.type] = (acc[w.type] || 0) + 1
    return acc
  }, {})
  const favoriteWorkout = Object.entries(topWorkout).sort((a, b) => b[1] - a[1])[0]
  const countries = [...new Set(data.places.map(p => p.country))]
  const topMood = data.moods.reduce((acc, m) => {
    acc[m.emoji] = (acc[m.emoji] || 0) + 1
    return acc
  }, {})
  const favoriteMood = Object.entries(topMood).sort((a, b) => b[1] - a[1])[0]
  const year = new Date().getFullYear()

  const slides = [
    // Slide 0 — Intro
    <Slide key="intro" gradient="linear-gradient(135deg, #1a1a2e, #16213e)">
      <motion.div
        className="wrapped-content"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="wrapped-year">{year}</p>
        <h2 className="wrapped-title">Tu año en datos</h2>
        <p className="wrapped-sub">Ha sido un año increíble. Veamos los números.</p>
      </motion.div>
    </Slide>,

    // Slide 1 — Películas
    <Slide key="movies" gradient="linear-gradient(135deg, #0f0c29, #302b63)">
      <motion.div className="wrapped-content" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        <p className="wrapped-emoji">🎬</p>
        <p className="wrapped-big">{data.movies.length}</p>
        <h2 className="wrapped-title">películas y series</h2>
        {topMovie && <p className="wrapped-sub">Tu favorita fue <strong>{topMovie.title}</strong> con {topMovie.rating}★</p>}
      </motion.div>
    </Slide>,

    // Slide 2 — Libros
    <Slide key="books" gradient="linear-gradient(135deg, #134e5e, #71b280)">
      <motion.div className="wrapped-content" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        <p className="wrapped-emoji">📚</p>
        <p className="wrapped-big">{data.books.length}</p>
        <h2 className="wrapped-title">libros leídos</h2>
        {topBook && <p className="wrapped-sub">El mejor fue <strong>{topBook.title}</strong> de {topBook.author}</p>}
      </motion.div>
    </Slide>,

    // Slide 3 — Entrenamientos
    <Slide key="workouts" gradient="linear-gradient(135deg, #f7971e, #ffd200)">
      <motion.div className="wrapped-content" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        <p className="wrapped-emoji">🏋️</p>
        <p className="wrapped-big" style={{ color: '#000' }}>{data.workouts.length}</p>
        <h2 className="wrapped-title" style={{ color: '#000' }}>entrenamientos</h2>
        <p className="wrapped-sub" style={{ color: '#333' }}>
          {totalMinutes} minutos en total
          {favoriteWorkout && ` · Tu favorito: ${favoriteWorkout[0]}`}
        </p>
      </motion.div>
    </Slide>,

    // Slide 4 — Lugares
    <Slide key="places" gradient="linear-gradient(135deg, #11998e, #38ef7d)">
      <motion.div className="wrapped-content" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        <p className="wrapped-emoji">🌍</p>
        <p className="wrapped-big" style={{ color: '#000' }}>{countries.length}</p>
        <h2 className="wrapped-title" style={{ color: '#000' }}>países visitados</h2>
        <p className="wrapped-sub" style={{ color: '#333' }}>
          {data.places.length} ciudades en total
          {countries.length > 0 && ` · ${countries.join(', ')}`}
        </p>
      </motion.div>
    </Slide>,

    // Slide 5 — Estado de ánimo
    <Slide key="mood" gradient="linear-gradient(135deg, #fc466b, #3f5efb)">
      <motion.div className="wrapped-content" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        <p className="wrapped-emoji">{favoriteMood ? favoriteMood[0] : '💭'}</p>
        <p className="wrapped-big">{data.moods.length}</p>
        <h2 className="wrapped-title">días registrados</h2>
        {favoriteMood && <p className="wrapped-sub">Tu emoji más frecuente fue {favoriteMood[0]}</p>}
      </motion.div>
    </Slide>,

    // Slide 6 — Final
    <Slide key="final" gradient="linear-gradient(135deg, #1a1a2e, #16213e)">
      <motion.div className="wrapped-content" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        <p className="wrapped-emoji">🌀</p>
        <h2 className="wrapped-title">Eso fue {year}</h2>
        <p className="wrapped-sub">
          {data.movies.length} películas · {data.books.length} libros · {data.workouts.length} entrenamientos · {countries.length} países
        </p>
        <motion.button
          className="submit-btn"
          style={{ marginTop: '2rem' }}
          onClick={() => { setSlide(0); setStarted(false) }}
          whileHover={{ scale: 1.05 }}
        >
          Ver de nuevo 🔄
        </motion.button>
      </motion.div>
    </Slide>
  ]

  if (!started) {
    return (
      <div className="page">
        <div className="wrapped-intro">
          <h2>✨ Tu Wrapped {year}</h2>
          <p className="page-subtitle">Un resumen animado de tu año completo</p>
          <button className="submit-btn wrapped-start-btn" onClick={() => setStarted(true)}>
            Ver mi Wrapped ✨
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="wrapped-container">
      <AnimatePresence mode="wait">
        {slides[slide]}
      </AnimatePresence>

      <div className="wrapped-controls">
        <button
          className="wrapped-nav"
          onClick={() => setSlide(s => Math.max(0, s - 1))}
          disabled={slide === 0}
        >
          ←
        </button>

        <div className="wrapped-dots">
          {slides.map((_, i) => (
            <span
              key={i}
              className={i === slide ? 'dot active' : 'dot'}
              onClick={() => setSlide(i)}
            />
          ))}
        </div>

        <button
          className="wrapped-nav"
          onClick={() => setSlide(s => Math.min(slides.length - 1, s + 1))}
          disabled={slide === slides.length - 1}
        >
          →
        </button>
      </div>
    </div>
  )
}

export default Wrapped