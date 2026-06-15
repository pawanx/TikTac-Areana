import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const ConnectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("MONGO DB connected", conn.connection.host)
    } catch (error) {
        console.error("Error while connecting DB: ",error.message);
        process.exit(1)
    }
}

export default ConnectDB;