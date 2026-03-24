import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Footer from './Footer'

function Layout({ children }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-top">
          <h1 className="logo">🌀 Wrapped</h1>
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              🏠 Dashboard
            </NavLink>
            <NavLink to="/peliculas" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              🎬 Películas
            </NavLink>
            <NavLink to="/libros" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              📚 Libros
            </NavLink>
            <NavLink to="/entrenamientos" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              🏋️ Entrenamientos
            </NavLink>
            <NavLink to="/lugares" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              🌍 Lugares
            </NavLink>
            <NavLink to="/animo" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              💭 Estado de ánimo
            </NavLink>
            <NavLink to="/wrapped" className={({ isActive }) => isActive ? 'nav-item active wrapped-link' : 'nav-item wrapped-link'}>
              ✨ Mi Wrapped
            </NavLink>
          </nav>
        </div>
        <button className="signout-btn" onClick={handleSignOut}>
          Cerrar sesión
        </button>
      </aside>

      <main className="content">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout