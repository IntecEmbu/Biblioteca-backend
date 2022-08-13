import nodeMailer from 'nodemailer'

// Configurações do transporter
const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PWD
    }
})

// Função para enviar o email
async function sendMail(to, subject, text) {
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text
    }

    await transporter.sendMail(mailOptions)
}

export default {
    sendMail
}