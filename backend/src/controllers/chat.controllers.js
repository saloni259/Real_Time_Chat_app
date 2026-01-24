import { Chat } from "../models/chat.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
// const sendMessage = asyncHandler(async(req,res) => {
//     const {receiverId,message} = req.body;
//     if((!receiverId) || (!message)){
//         throw new apiError(404,"No chats..")
//     }
//     const chat = await Chat.create({
//         sender:req?.user._id,
//         receiver:receiverId,
//         message:message
//     })
//     return res.status(200).json(
//         new apiResponse(200,chat,"Chat sending successfully.....")
//     )
// })

const getChats = asyncHandler(async(req,res) => {
    const { userId } = req.body; 

    if (!userId) {
        throw new apiError(400, "User id is required");
    }

    const chats = await Chat.find({
        $or: [
            { sender: req.user._id, receiver: userId },
            { sender: userId, receiver: req.user._id }
        ]
    })
    .populate("sender", "name email")
    .populate("receiver", "name email")
    .sort({ createdAt: 1 }); 

    res.status(200).json(
        new apiResponse(200, chats, "Chats fetched successfully")
    );
})

export {getChats}