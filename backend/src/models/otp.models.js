import mongoose,{Schema} from "mongoose";


const OTPSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiryAt: {
        type: Date,
        required: true
    },
    
},{timestamps:true})


export const OTP = mongoose.model("OTP",OTPSchema)