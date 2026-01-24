import dotenv from "dotenv"
dotenv.config({path:'./.env'})
import http from "http"


import {app} from "./app.js"
import conectDB  from "./db/index.js"
import { initSocket } from "./utils/socket.js"
import { chatSocket } from "./socket/chat.socket.js"

conectDB()

.then(() => {
    const server = http.createServer(app);
    const io = initSocket(server)
    chatSocket(io)
    app.on("error",(error) => {
        console.log("ERROR : error");
        throw error
    })
    server.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
        
    })
})
.catch((err) => {
    console.log("MONGODB connection failled !!!",err);
})