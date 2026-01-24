import { Chat } from "../models/chat.models.js";


const chatSocket = (io) => {

    io.on("connection", (socket) => {
        console.log("User connected with socket id:", socket.id);

        socket.on("join", (userId) => {
            socket.join(userId);
            console.log(`User joined room : ${userId}`)
        })

        socket.on("sendMessage", async (data) => {
            try {
                // MEDICARE_AI_COMMENT: Create a new chat record in the database
                const chat = await Chat.create({
                    sender: data.sender,
                    receiver: data.receiver,
                    message: data.message
                });

                // MEDICARE_AI_COMMENT: Emit the message to the receiver and the sender
                io.to(data.receiver).emit("receiveMessage", chat);
                socket.emit("receiveMessage", chat);
            } catch (error) {
                console.log("Error sending message:", error);
            }
        })


        socket.on("disconnet", () => {
            console.log("User disconnected:", socket.id);
        })
    })
}

export { chatSocket }