import express from 'express'
import nm from '../Mail/Nodemailer.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Endpoint: /email/send-email (POST)
// Description: Send an email
router.post('/send-email',[
    body('to').isEmail().withMessage('Email is not valid'),
    body('subject').isString().withMessage('Subject is not valid'),
    body('text').isString().withMessage('Text is not valid')
], async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

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