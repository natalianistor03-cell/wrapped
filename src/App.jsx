import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Movies from './pages/Movies'
import Books from './pages/Books'
import Workouts from './pages/Workouts'
import Places from './pages/Places'
import Mood from './pages/Mood'
import Wrapped from './pages/Wrapped'
import NotFound from './pages/NotFound'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/peliculas" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
      <Route path="/libros" element={<ProtectedRoute><Books /></ProtectedRoute>} />
      <Route path="/entrenamientos" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
      <Route path="/lugares" element={<ProtectedRoute><Places /></ProtectedRoute>} />
      <Route path="/animo" element={<ProtectedRoute><Mood /></ProtectedRoute>} />
      <Route path="/wrapped" element={<ProtectedRoute><Wrapped /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App