import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getChats } from "../controllers/chat.controllers.js";


const chatRouter = Router();

//chatRouter.route("/send_message").post(upload.none(),verifyJWT,sendMessage);
chatRouter.route("/get_chats").post(upload.none(),verifyJWT,getChats);

export {chatRouter}