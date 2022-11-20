const fs = require('fs')
const nodemailer = require('nodemailer')
const Mustache = require('mustache')
const { email, password } = require('../../config')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: email,
        pass: password
    }
})

const otpMail = async (emailDestination, data) => {
    try {
        let template = fs.readFileSync('app/views/email/otp.html', 'utf-8')

        let message = {
            from: email,
            to: emailDestination,
            subject: 'OTP for registration is: ',
            html: Mustache.render(template, data)
        }

        return await transporter.sendMail(message)
    } catch (error) {
        console.log(error);
    }
}

module.exports = otpMail