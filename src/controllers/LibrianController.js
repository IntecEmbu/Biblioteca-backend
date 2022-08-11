import express from 'express'
import db from '../services/LibrianService.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Endpoint: /librian/insert (POST)
// Description: Insert a new librian
router.post('/insert-voluntary',[
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').not().isEmpty().withMessage('Email is required'),
    body('password').not().isEmpty().withMessage('Password is required')
], async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {name, email, passsword} = req.body

    try {
        await db.insertVoluntary({name, email, passsword})
        res.status(200).json({
            message: 'Voluntary inserted successfully'
        })
    }
    catch (error) {
        return res.status(500).json({
            DatabaseError: error.message
        })
    }
})
