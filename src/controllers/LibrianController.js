import express from 'express'
import db from '../services/LibrianService.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Endpoint: /librian/insert-collaborator (POST)
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
    catch(error){
        return res.status(500).json({
            DatabaseError: error.message
        })
    }
})

// Endpoint: /librian/login-collaborator (POST)
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
        } else{
            res.status(400).json({
                message: 'Login failed'
            })
        }
    } catch(error){
        return res.status(500).json({
            DatabaseError: error.message
        })
    }
})

// Endpoint: /librian/status-collaborator (POST)
// Description: change status of a librian
router.post('/status-collaborator',[
    body('id').not().isEmpty().withMessage('Id is required'),
    body('status').not().isEmpty().withMessage('Status is required')
], async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {id, status} = req.body

    if(status.toLowerCase() === 'ativo'){
        try {
            await db.activatedCollaborator(id)
            res.status(200).json({
                message: 'Collaborator activated successfully'
            })
        } catch(error){
            return res.status(500).json({
                DatabaseError: error.message
            })
        }
    }
    else if(status.toLowerCase() === 'inativo'){
        try {
            await db.deactivatedCollaborator(id)
            res.status(200).json({
                message: 'Collaborator deactivated successfully'
            })
        } catch(error){
            return res.status(500).json({
                DatabaseError: error.message
            })
        }
    } else{
        return res.status(400).json({
            message: 'Status invalid'
        })
    }
})


// Endpoint: /librian/get-all-collaborators (GET)
// Description: get all collaborators
router.get('/all-collaborators', async (req, res) => {
    try {
        const result = await db.getAllCollaborators()

        if(result.length > 0){
            res.status(200).json({
                message: 'Collaborators found',
                data: result
            })
        } else{
            res.status(400).json({
                message: 'Collaborators not found'
            })
        }
    } catch(error){
        return res.status(500).json({
            DatabaseError: error.message
        })
    }
})

// Endpoint: /librian/get-collaborator-active (GET)
// Description: get all collaborators active
router.get('/collaborators-active', async (req, res) => {
    try {
        const result = await db.getCollaboratorsActive()

        if(result.length > 0){
            res.status(200).json({
                message: 'Collaborators found',
                data: result
            })
        } else{
            res.status(400).json({
                message: 'Collaborators not found'
            })
        }
    } catch(error){
        return res.status(500).json({
            DatabaseError: error.message
        })
    }
})

// Endpoint: /librian/get-collaborator-inactive (GET)
// Description: get all collaborators inactive
router.get('/collaborators-inactive', async (req, res) => {
    try {
        const result = await db.getCollaboratorsInactive()

        if(result.length > 0){
            res.status(200).json({
                message: 'Collaborators found',
                data: result
            })
        } else{
            res.status(400).json({
                message: 'Collaborators not found'
            })
        }
    } catch(error){
        return res.status(500).json({
            DatabaseError: error.message
        })
    }
})

export default router