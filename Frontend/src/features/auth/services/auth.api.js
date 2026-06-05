import axios from "axios"

const API_URL = import.meta.env.PROD ? "" : "http://localhost:3000"

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

function getErrorMessage(error) {
    return error.response?.data?.message || error.message || "Something went wrong"
}

export async function register({ username, email, password }) {
    try {
        const response = await api.post("/api/auth/signup", {
            username, email, password
        })

        return response.data
    } catch (err) {
        throw new Error(getErrorMessage(err))
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", {
            email, password
        })

        return response.data
    } catch (err) {
        throw new Error(getErrorMessage(err))
    }
}

export async function logout() {
    try {
        const response = await api.post("/api/auth/logout")

        return response.data
    } catch (err) {
        throw new Error(getErrorMessage(err))
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/check")

        return response.data
    } catch (err) {
        throw new Error(getErrorMessage(err))
    }
}
