import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    sendingOtpViaMailForRegistration,
    otpVerificationAndRegisterViaMail,
    login,
    logout,
    forgotPasswordSendOtp,
    verifyOtpandResetPassword,
    changePassword,
    changeProfile,
    deleteAccount,
    getAllUsers,
    getChatHistory

} from "../controllers/user.controllers.js";

const userRouter = Router();


userRouter
    .route("/send_registrationotp_viamail")
    .post(upload.none(), sendingOtpViaMailForRegistration)
userRouter
    .route("/verify_registrationotpand_register")
    .post(upload.single("profile"), otpVerificationAndRegisterViaMail)
userRouter.route("/login").post(upload.none(),  login)
userRouter.route("/logout").post(verifyJWT, logout)
userRouter.route("/forgot_password").post(upload.none(), forgotPasswordSendOtp);
userRouter.route("/verify_reset_password").post(upload.none(), verifyOtpandResetPassword);
userRouter.route("/Reset_password").post(verifyJWT, upload.none(), changePassword);
userRouter.route("/change_profile").post(verifyJWT, upload.single("profile"), changeProfile);
userRouter.route("/delete_account").post(verifyJWT, deleteAccount);


userRouter.route("/all_users").get(verifyJWT, getAllUsers);


userRouter.route("/chat_history/:receiverId").get(verifyJWT, getChatHistory);

export { userRouter }