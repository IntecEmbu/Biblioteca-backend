import emailTemplate from './template.js'
import sendEmail from '../services/sendEmail.js'

async function welcomeUser(name, to){
    const html = emailTemplate(
        'Empréstimo realizado!',
        name,
        `<p>
            Você pegou o livro <b>O Senhor dos Anéis</b> emprestado na biblioteca da ETEC de Embu. Fique atento com o
            prazo, pois o atraso na devolução do livro resultará em multa.
          </p>
          <br>
          <p>
            Código do emprestimo: 1
            <br>
            Data de devolução: 29/09/202 (quinta-feira)
          </p>`
    )
    
    const subject = 'Boas vindas!'

    await sendEmail(to, subject,html)
}

export default welcomeUser
