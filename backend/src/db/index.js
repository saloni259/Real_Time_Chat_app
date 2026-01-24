import dotenv from "dotenv"
dotenv.config({path:'./.env'})


import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const conectDB = async () => {
      try {
        const take = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log('\nMONGOODB CONNECTED !!!!!!',take.connection.host)
      } catch (error) {
        console.log("MONGOODB CONNECTION FAILED....",error);
        process.exit(1);
      }

}

export default conectDB;