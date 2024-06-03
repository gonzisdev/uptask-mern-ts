import mongoose from "mongoose"
import { exit } from 'node:process'
import colors from "colors"

export const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.DATABASE_URL)
        const url = `${connection.host}:${connection.port}`
        console.log(colors.magenta.bold(`MongoDB conectado en: ${url}`))
    } catch (error) {
        console.log(error.message)
        exit(1)
    }
}