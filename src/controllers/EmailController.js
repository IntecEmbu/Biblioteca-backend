import express from 'express'
import '../Mail/Nodemailer'
const router = express.Router()

// Endpoint: /email/send-email (POST)
// Description: Send an email
router.post('/send-email', async (req, res) => {

    const {email, subject, text} = req.body

    try {
        await sendMail(email, subject, text)
        res.status(200).json({
            message: 'Email sent successfully'
        })
    } catch(error){
        res.status(500).json({
            DatabaseError: error.message
        })
    }
})

