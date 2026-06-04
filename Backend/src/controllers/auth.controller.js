const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000

function getCookieOptions() {
    const isProduction = process.env.NODE_ENV === "production"

    return {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        maxAge: ONE_DAY_IN_MS
    }
}

function getClearCookieOptions() {
    const { maxAge, ...cookieOptions } = getCookieOptions()
    return cookieOptions
}

function createAuthToken(user) {
    return jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
}

function setAuthCookie(res, token) {
    res.cookie("token", token, getCookieOptions())
}

function formatUser(user) {
    return {
        id: user._id,
        username: user.username,
        email: user.email
    }
}

function normalizeText(value) {
    return typeof value === "string" ? value.trim() : ""
}

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {
    try {
        const username = normalizeText(req.body.username)
        const email = normalizeText(req.body.email).toLowerCase()
        const password = req.body.password

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email and password"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            })
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or: [ { username }, { email } ]
        })

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "Account already exists with this email address or username"
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hash
        })

        const token = createAuthToken(user)
        setAuthCookie(res, token)

        return res.status(201).json({
            message: "User registered successfully",
            user: formatUser(user)
        })
    } catch (error) {
        console.log("Error in registerUserController", error.message)

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {
    try {
        const email = normalizeText(req.body.email).toLowerCase()
        const password = req.body.password

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = createAuthToken(user)
        setAuthCookie(res, token)

        return res.status(200).json({
            message: "User logged in successfully",
            user: formatUser(user)
        })
    } catch (error) {
        console.log("Error in loginUserController", error.message)

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token

        if (token) {
            await tokenBlacklistModel.create({ token })
        }

        res.clearCookie("token", getClearCookieOptions())

        return res.status(200).json({
            message: "User logged out successfully"
        })
    } catch (error) {
        console.log("Error in logoutUserController", error.message)

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            message: "User details fetched successfully",
            user: formatUser(user)
        })
    } catch (error) {
        console.log("Error in getMeController", error.message)

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}



module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}
