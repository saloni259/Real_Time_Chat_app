import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.models.js"
import { OTP } from "../models/otp.models.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { generateStringOtp } from "../utils/generateStringotp.js"
import { sendMail } from "../utils/sendMail.js"
import { Chat } from "../models/chat.models.js";
import crypto from "node:crypto";

const generateRefreshAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new apiError(500, "User not fount")
        }
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { refreshToken, accessToken }

    } catch (error) {
        throw new apiError(500, "Something went wrong")
    }
}

const sendingOtpViaMailForRegistration = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new apiError(401, "Email is required");
    }
    if (!(email === email.toLowerCase()) || !email.includes("@")) {
        throw new apiError(403, "Invalid email..")
    }
    await OTP.findOneAndDelete({ email });
    const otp = generateStringOtp();
    console.log(otp);
    const hashedOtp = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex")


    await sendMail(
        email,
        "Verify your Email....",
        `Your one time otp is "${otp}" please copy this otp
        and verify your mail for registration`
    )
    const otpUser = await OTP.create({
        email: email,
        otp: hashedOtp,
        expiryAt: Date.now() + 5 * 60 * 1000,
    })
    return res.status(200).json(
        new apiResponse(200, {}, "Send otp succsessfully")
    )
})

const otpVerificationAndRegisterViaMail = asyncHandler(async (req, res) => {
    const { email, otp, fullname, username, password } = req.body;

    if (!email || !otp || !fullname || !username || !password) {
        throw new apiError(400, "Please fill all necessary fields")
    }

    const isPresent = await User.findOne({ email })
    if (isPresent) {
        throw new apiError(401, "Email already registered")
    }

    const otpUser = await OTP.findOne({ email })
    if (!otpUser) {
        throw new apiError(404, "Otp not send yet")
    }
    const hashedOtp = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex")

    if (otpUser.otp !== hashedOtp || otpUser.expiryAt < Date.now()) {
        throw new apiError(405, "Invalid or expired otp")
    }
    await OTP.findOneAndDelete({ email });
    const profilePath = req?.file?.path;
    const profile = await uploadOnCloudinary(profilePath);
    const user = await User.create({
        fullname: fullname,
        username: username,
        email: email,
        password: password,
        profilePicture: profile?.url || "",
        profilePicture_ID: profile?.public_id || ""
    })

    const verify = await User.findById(user?._id);
    if (!verify) {
        throw new apiError(500, "Opps !!!! Registration failed....Try again")
    }
    const { refreshToken, accessToken } = await generateRefreshAccessToken(user._id)
    const options = {
        httpOnly: true,
        secure: true
    }
    await sendMail(
        verify.email,
        "Registration complete",
        "you registered successfully"
    )
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(200, verify, "registration Successfully...")
        )
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        throw new apiError(400, "Email is required")
    }
    if (!password) {
        throw new apiError(401, "Password is required")
    }
    if (!(email === email.toLowerCase()) || !email.includes("@")) {
        throw new apiError(403, "Invalid email..")
    }
    //console.log(email);
    const user = await User.findOne({ email: email });
    //console.log(user);
    //const users = await User.find({});
    //console.log("TOTAL USERS:", users.length);

    if (!user) {
        throw new apiError(404, "No account exist with this mail")
    }
    const validpassword = await user.isPasswordCorrect(password);

    if (!validpassword) {
        throw new apiError(405, "Password is not correct")
    }
    const { refreshToken, accessToken } = await generateRefreshAccessToken(user._id)


    const options = {
        httpOnly: true,
        secure: true
    }

    const newuser = await User.findById(user._id).select("-password -refreshToken")
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(200, {
                User: newuser, refreshToken, accessToken
            }, "Login successfully....")
        )
})

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new apiResponse(200, {}, "You logout....")
        )
})

const forgotPasswordSendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new apiError(401, "Email is required");
    }
    if (!(email === email.toLowerCase()) || !email.includes("@")) {
        throw new apiError(403, "Invalid email..")
    }
    await OTP.findOneAndDelete({ email });
    const otp = generateStringOtp();
    
    const hashedOtp = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex")


    await sendMail(
        email,
        "Verify your Email....",
        `Your one time otp is "${otp}" please copy this otp
        and verify your mail for reset password`
    )
    const otpUser = await OTP.create({
        email: email,
        otp: hashedOtp,
        expiryAt: Date.now() + 5 * 60 * 1000,
    })
    return res.status(200).json(
        new apiResponse(200, {}, "Send otp succsessfully")
    )
})

const verifyOtpandResetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword, confirmPassword } = req.body;
    if (!email || !otp || !newPassword || !confirmPassword) {
        throw new apiError(400, "Please fill all required field")
    }
    if (newPassword !== confirmPassword) {
        throw new apiError("New password should be equal to Confirm password")
    }
    const otpUser = OTP.findOne({ email })
    if (!otpUser) {
        throw new apiError(400, "Otp not send to your mail");
    }
    const hashedOtp = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex")

    if (hashedOtp !== otpUser.otp || otpUser.expiryAt < Date.now()) {
        throw new apiError(404, "Invalid or Expired otp")
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new apiError(405, "User not found")
    }
    user.password = newPassword;
    await user.save()

    return res.status(200).json(
        new apiResponse(200, {}, "Reset password Successfully")
    )

})

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) {
        throw new apiError("All fields are required")
    }
    if (oldPassword === newPassword) {
        throw new apiError("old password and new password should not be same")
    }
    if (newPassword !== confirmPassword) {
        throw new apiError("Both new password and confirm password should be equal")
    }
    const user = await User.findById(req?.user._id);
    if (!user) {
        throw new apiError(500, "User not found");
    }
    const validation = await user.isPasswordCorrect(oldPassword)
    if (!validation) {
        throw new apiError(400, "Old Password is not correct")
    }
    user.password = newPassword;
    await user.save()
    return res.status(200).json(
        new apiResponse(200, {}, "Password change successfully...")
    )
})

const changeProfile = asyncHandler(async (req, res) => {
    const newProfilePath = req?.file?.path;


    if (!newProfilePath) {
        throw new apiError(400, "New profile required");
    }

    const newprofile = await uploadOnCloudinary(newProfilePath);
    if (!newprofile) {
        throw new apiError(500, "Problem in uploading new profile picture")
    }

    const user = await User.findById(req?.user?._id);
    if (!user) {
        throw new apiError(500, "User not found");
    }
    //console.log(user.profile_id);
    if (user.profile_id) {
        await deleteFromCloudinary(user.profile_id)
    }

    user.profile = newprofile.url;
    user.profile_id = newprofile.public_id;
    await user.save();

    return res.status(200).json(
        new apiResponse(200, {}, "profile picture changed")
    )

})


const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password -refreshToken");
    return res.status(200).json(
        new apiResponse(200, users, "Users fetched successfully")
    );
});


const getChatHistory = asyncHandler(async (req, res) => {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    if (!receiverId) {
        throw new apiError(400, "Receiver ID is required");
    }

    const chats = await Chat.find({
        $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId }
        ]
    }).sort({ createdAt: 1 });

    return res.status(200).json(
        new apiResponse(200, chats, "Chat history fetched successfully")
    );
});

const deleteAccount = asyncHandler(async (req, res) => {
    const user = await User.findById(req?.user._id);
    if (!user) {
        throw new apiError(500, "User not found");
    }
    await User.findByIdAndDelete(req?.user._id);
    return res.status(200).json(
        new apiResponse(200, {}, "Account deleted successfully")
    )
})
export {
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
}