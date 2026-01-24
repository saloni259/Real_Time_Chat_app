const generateStringOtp = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";
    let otp = "";
    for(let i=0; i<5; i++){
        otp += chars.charAt(Math.floor(Math.random()*chars.length));
    }
    return otp;
}
export {generateStringOtp}