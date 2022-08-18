import express from 'express'
import nm from '../Mail/Nodemailer.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Endpoint: /email/send-email (POST)
// Description: Send an email
router.get('/send-email', async (req, res) => {


    const email = 'email@gmail.com'
    const subject = 'Teste de envio de email'
    const text = 'Teste de envio de email'

    try {
        await nm.sendMail(email, subject, text)

        res.status(200).json({
            message: 'Email sent successfully'
        })
    } catch(error){
        res.status(500).json({
            emailError: error.message
        })
    }
})

export default router