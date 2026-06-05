const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: true,
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

// Serve frontend static files in production
const path = require("path")
app.use(express.static(path.join(__dirname, "../../Frontend/dist")))

// Catch-all route to serve index.html for React Router
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/dist/index.html"))
})

module.exports = app