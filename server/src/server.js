import express from "express";
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

import ConnectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"

ConnectDB()

const app = express()
app.use(express.json());

app.use(cors())

app.use("/api/auth", authRoutes)

const PORT = process.env.PORT || 5000


app.listen(PORT, () => {
    console.log("App is running on PORT", PORT)
})