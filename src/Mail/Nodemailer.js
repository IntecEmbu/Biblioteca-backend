import nodeMailer from 'nodemailer'

// Configurações do transporter
const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PWD,
    },
    tls: {
      rejectUnauthorized: false,
    }
});

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