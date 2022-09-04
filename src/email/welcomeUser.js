import emailTemplate from './template.js'
import sendEmail from '../services/sendEmail.js'

async function welcomeUser(name, to){
    const html = emailTemplate(
        'Bem-vindo(a)',
        name,
        'Agora você pode realizar empréstimos e devoluções de livros utilizando o sistema Biblitec. Aproveite!'
    )
    
    const subject = 'Boas vindas!'

    await sendEmail(to, subject,html)
}

export default welcomeUser
