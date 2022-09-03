import emailTemplate from './template.js'
import sendMail from '../services/SendMail.js'

async function welcomeUser(name, to){
    const html = emailTemplate(
        'Bem-vindo(a)',
        name,
        'Agora você pode realizar empréstimos e devoluções de livros utilizando o sistema Biblitec. Aproveite!'
    )
    
    const subject = 'Boas vindas!'

    await sendMail({
        to,
        html,
        subject
    })
}

export default welcomeUser
