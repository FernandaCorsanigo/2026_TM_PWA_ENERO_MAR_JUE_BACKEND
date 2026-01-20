import nodemailer from "nodemailer";
import ENVIRONMENT from "./enviroment.config.js"

const mail_transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: ENVIRONMENT.GMAIL_USERNAME,
        pass: ENVIRONMENT.GMAIL_PASSWORD
    }
})

export default mail_transporter