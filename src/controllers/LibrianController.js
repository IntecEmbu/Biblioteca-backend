import express from 'express'
import db from '../services/LibrianService.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Endpoint: /librian/insert (POST)
// Description: Insert a new librian
router.post('/insert-collaborator',[
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
        await db.insertCollaborator({name, email, passsword})
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

// Endpoint: /librian/login (POST)
// Description: Login a librian
router.post('/login-collaborator',[
    body('email').not().isEmpty().withMessage('Email is required'),
    body('password').not().isEmpty().withMessage('Password is required')
], async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {email, password} = req.body

    try{
        const result = await db.loginCollaborator({email, password})

        if(result.length > 0){
            res.status(200).json({
                message: 'Login successful',
                data: result
            })
        }
        else{
            res.status(400).json({
                message: 'Login failed'
            })
        }
    } catch (error) {
        return res.status(500).json({
            DatabaseError: error.message
        })
    }
})

export default router