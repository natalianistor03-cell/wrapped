import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import YearFilter from './YearFilter'
import Footer from './Footer'
import {
  Rotate3d, House, Popcorn, BookOpenText,
  Dumbbell, MapPinned, Sticker, Sunset,
  WandSparkles, LogOut
} from 'lucide-react'

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
          <h1 className="logo"><Rotate3d size={22} /> Wrapped</h1>
          <YearFilter />
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <House size={18} /> Dashboard
            </NavLink>
            <NavLink to="/peliculas" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Popcorn size={18} /> Películas
            </NavLink>
            <NavLink to="/libros" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <BookOpenText size={18} /> Libros
            </NavLink>
            <NavLink to="/entrenamientos" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Dumbbell size={18} /> Entrenamientos
            </NavLink>
            <NavLink to="/lugares" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <MapPinned size={18} /> Lugares
            </NavLink>
            <NavLink to="/animo" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Sticker size={18} /> Ánimo
            </NavLink>
            <NavLink to="/atardeceres" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Sunset size={18} /> Atardeceres
            </NavLink>
            <NavLink to="/wrapped" className={({ isActive }) => isActive ? 'nav-item active wrapped-link' : 'nav-item wrapped-link'}>
              <WandSparkles size={18} /> Wrapped
            </NavLink>
            <button className="nav-signout" onClick={handleSignOut}>
              <LogOut size={18} /> Salir
            </button>
          </nav>
        </div>
        <button className="signout-btn" onClick={handleSignOut}>
          <LogOut size={16} /> Cerrar sesión
        </button>
      </aside>
      <main className="content">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout