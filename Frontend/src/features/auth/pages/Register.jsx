import React,{useEffect,useState} from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import "../auth.form.scss"
import AuthVisual from '../components/AuthVisual'

const Register = () => {

    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    const { loading, authActionLoading, authError, setAuthError, handleRegister } = useAuth()

    useEffect(() => {
        setAuthError("")
    }, [ setAuthError ])

    const validateForm = () => {
        const trimmedEmail = email.trim()

        if (!username.trim()) return "Username is required"
        if (!trimmedEmail) return "Email is required"
        if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) return "Please enter a valid email address"
        if (!password) return "Password is required"
        if (password.length < 6) return "Password must be at least 6 characters"

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

        const isRegistered = await handleRegister({
            username: username.trim(),
            email: email.trim(),
            password
        })

        if (isRegistered) {
            navigate("/")
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
        <main className="auth-page auth-page--register">
            <AuthVisual mode="register" />

            <section className="auth-card" aria-labelledby="register-title">
                <div className="auth-card__header">
                    <p className="auth-kicker">Start preparing</p>
                    <h1 id="register-title">Create your PrepAI account</h1>
                    <p>Save plans, track gaps, and keep your interview practice organized.</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label htmlFor="username">Username</label>
                        <input
                            value={username}
                            onChange={(e) => { setUsername(e.target.value) }}
                            type="text"
                            id="username"
                            name="username"
                            placeholder="akash"
                            autoComplete="username"
                        />
                    </div>

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
                            placeholder="At least 6 characters"
                            autoComplete="new-password"
                        />
                    </div>

                    {authError && <p className="auth-error" role="alert">{authError}</p>}

                    <button className="button primary-button auth-submit" disabled={authActionLoading}>
                        {authActionLoading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
            </section>
        </main>
    )
}

export default Register
