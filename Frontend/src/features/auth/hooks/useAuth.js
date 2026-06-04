import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }

    const {
        user,
        setUser,
        loading,
        authActionLoading,
        setAuthActionLoading,
        authError,
        setAuthError
    } = context


    const handleLogin = async ({ email, password }) => {
        setAuthActionLoading(true)
        setAuthError("")

        try {
            const data = await login({ email, password })
            setUser(data.user)
            return true
        } catch (err) {
            setUser(null)
            setAuthError(err.message)
            return false
        } finally {
            setAuthActionLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setAuthActionLoading(true)
        setAuthError("")

        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            return true
        } catch (err) {
            setUser(null)
            setAuthError(err.message)
            return false
        } finally {
            setAuthActionLoading(false)
        }
    }

    const handleLogout = async () => {
        setAuthActionLoading(true)
        setAuthError("")

        try {
            await logout()
            setUser(null)
            return true
        } catch (err) {
            setAuthError(err.message)
            return false
        } finally {
            setAuthActionLoading(false)
        }
    }

    return {
        user,
        loading,
        authActionLoading,
        authError,
        setAuthError,
        handleRegister,
        handleLogin,
        handleLogout
    }
}
