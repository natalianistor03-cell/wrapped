import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

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

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Introduce tu email primero.')
      return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) {
      setError(error.message)
    } else {
      setResetSent(true)
      setError('')
    }
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

        {!resetSent && (
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        {error && <p className="login-error">{error}</p>}

        {resetSent && (
          <p className="login-success">
            ✅ Te hemos enviado un email para restablecer tu contraseña.
          </p>
        )}

        {!resetSent && (
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading || !email || !password}
          >
            {loading ? 'Cargando...' : isRegister ? 'Crear cuenta' : 'Entrar'}
          </button>
        )}

        {!isRegister && !resetSent && (
          <button className="forgot-btn" onClick={handleForgotPassword}>
            ¿Olvidaste tu contraseña?
          </button>
        )}

        {resetSent && (
          <button className="forgot-btn" onClick={() => setResetSent(false)}>
            Volver al login
          </button>
        )}
      </div>
    </div>
  )
}

export default Login