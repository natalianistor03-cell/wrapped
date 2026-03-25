import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="notfound-page">
      <p className="notfound-code">4🌀4</p>
      <h2 className="notfound-title">Página no encontrada</h2>
      <p className="notfound-sub">La página que buscas no existe o fue movida.</p>
      <button className="submit-btn" onClick={() => navigate('/')}>
        Volver al inicio
      </button>
    </div>
  )
}

export default NotFound