import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) return
    setLoading(true)
    setError('')

    const { error } = isRegister
      ? await signUp(email, password)
      : await signIn(email, password)

    if (error) {
      setError(error.message)
    } else {
      if (isRegister) {
        setError('¡Revisa tu email para confirmar tu cuenta!')
      } else {
        navigate('/')
      }
    }
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>🌀 Wrapped Personal</h1>
        <p className="login-subtitle">Tu año en datos</p>

        <div className="type-toggle">
          <button
            className={!isRegister ? 'toggle-btn active-ingreso' : 'toggle-btn'}
            onClick={() => setIsRegister(false)}
          >
            Iniciar sesión
          </button>
          <button
            className={isRegister ? 'toggle-btn active-ingreso' : 'toggle-btn'}
            onClick={() => setIsRegister(true)}
          >
            Registrarse
          </button>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="login-error">{error}</p>}

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading || !email || !password}
        >
          {loading ? 'Cargando...' : isRegister ? 'Crear cuenta' : 'Entrar'}
        </button>
      </div>
    </div>
  )
}

export default Login