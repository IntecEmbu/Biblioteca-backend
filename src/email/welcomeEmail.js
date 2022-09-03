import emailTemplate from './template.js'

function welcomeEmail(name){
    return emailTemplate(
        'Bem vindo(a)',
        name,
        'Agora você pode realizar empréstimos e devoluções de livros utilizando o sistema Biblitec. Aproveite!'
    )
}

export default welcomeEmail
