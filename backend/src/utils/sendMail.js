import nodemailer from "nodemailer"



//Function for sending mail to user
const sendMail = async(to,subject,text) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    })
}

export {sendMail}