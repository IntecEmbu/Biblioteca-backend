import nodeMailer from 'nodemailer'

// Cria um transporter para o envio de emails
function createTransporter(){
  return nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PWD_APP
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

// Envia email com texto simples
async function sendMailText(to, subject, text) {

  const transporter = createTransporter()
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  }

  await transporter.sendMail(mailOptions)
}


// Envia email com html 
async function sendMailHTML(to, subject, html) {

  const transporter = createTransporter()

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  }

  await transporter.sendMail(mailOptions)
}


export default {
  sendMailText,
  sendMailHTML
}