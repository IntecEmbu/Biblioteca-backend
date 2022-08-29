import axios from "axios"
import { config } from "dotenv"

config() // Carrega as variáveis de ambiente do .env

// Cria uma instância do axios para ser usada em todos os métodos
const api = axios.create({
    baseURL: process.env.URL_SERVER_EMAIL
})

// Método para enviar e-mail
async function sendMail(data) {

    // Verifica se os dados foram passados corretamente
    if (!data.to || !data.subject || !data.html) {
        throw new Error('Data is not valid')
    }

    // Envia o e-mail
    await api.post('/send/html', {
        to: data.to,
        subject: data.subject,
        html: data.html,
    })

    // Retorna o resultado
    return true
}

// Exporta o método sendMail
export default sendMail