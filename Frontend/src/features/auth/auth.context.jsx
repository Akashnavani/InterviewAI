import { createContext, useEffect, useState } from "react";
import { getMe } from "./services/auth.api";


export const AuthContext = createContext()


export const AuthProvider = ({ children }) => { 

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [authActionLoading, setAuthActionLoading] = useState(false)
    const [authError, setAuthError] = useState("")

    useEffect(() => {
        let isMounted = true

        async function loadUser() {
            try {
                const data = await getMe()

                if (isMounted) {
                    setUser(data.user)
                }
            } catch (err) {
                if (isMounted) {
                    setUser(null)
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        loadUser()

        return () => {
            isMounted = false
        }
    }, [])


    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            setLoading,
            authActionLoading,
            setAuthActionLoading,
            authError,
            setAuthError
        }} >
            {children}
        </AuthContext.Provider>
    )

    
}
