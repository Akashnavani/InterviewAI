import React,{useEffect,useState} from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import AuthVisual from '../components/AuthVisual'

const Login = () => {

    const { loading, authActionLoading, authError, setAuthError, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    useEffect(() => {
        setAuthError("")
    }, [ setAuthError ])

    const validateForm = () => {
        const trimmedEmail = email.trim()

        if (!trimmedEmail) return "Email is required"
        if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) return "Please enter a valid email address"
        if (!password) return "Password is required"

        return ""
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setAuthError("")

        const validationMessage = validateForm()

        if (validationMessage) {
            setAuthError(validationMessage)
            return
        }

        const isLoggedIn = await handleLogin({
            email: email.trim(),
            password
        })

        if (isLoggedIn) {
            navigate('/')
        }
    }

    if(loading){
        return (
            <main className="auth-loading">
                <span className="auth-loader" />
                <h1>Loading session...</h1>
            </main>
        )
    }


    return (
        <main className="auth-page auth-page--login">
            <AuthVisual mode="login" />

            <section className="auth-card" aria-labelledby="login-title">
                <div className="auth-card__header">
                    <p className="auth-kicker">Welcome back</p>
                    <h1 id="login-title">Sign in to PrepAI</h1>
                    <p>Continue your interview practice with your saved plans.</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label htmlFor="email">Email</label>
                        <input
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">Password</label>
                        <input
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />
                    </div>

                    {authError && <p className="auth-error" role="alert">{authError}</p>}

                    <button className="button primary-button auth-submit" disabled={authActionLoading}>
                        {authActionLoading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="auth-switch">New to PrepAI? <Link to="/register">Create account</Link></p>
            </section>
        </main>
    )
}

export default Login
