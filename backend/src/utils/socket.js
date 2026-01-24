import { Server } from "socket.io"

let io;

const initSocket = (server) => {
      io = new Server(server,
        {
            cors: {
                origin: "*",
                methods: ["GET","POST"]
            }
        }
      );
    return io;
}

const getIo = () => {
    if(!io){
        throw new Error("Socket.io not initialized")
    }
    return io;
}

export {initSocket,getIo}