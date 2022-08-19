import express from 'express'
import db from '../services/LibrianService.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Endpoint: /librian/insert-collaborator (POST)
// Descrição: Cadastra um colaborador no banco de dados
router.post('/insert-collaborator',[
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').not().isEmpty().withMessage('Email is required'),
    body('password').not().isEmpty().withMessage('Password is required'),
    body('login').not().isEmpty().withMessage('Login is required')
], async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {name, email, login, passsword} = req.body

    try {
        await db.createCollaborator({name, email, login, passsword})
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
// Descrição: Login de um colaborador no sistema
router.post('/login-collaborator',[
    body('login').not().isEmpty().withMessage('Email is required'),
    body('password').not().isEmpty().withMessage('Password is required')
], async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {login, password} = req.body

    try{
        const result = await db.loginCollaborator({login, password})

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
// Descrição: Altera o status de um colaborador 
router.post('/status-collaborator',[
    body('id').not().isEmpty().withMessage('Id is required'),
    body('newStatus').not().isEmpty().withMessage('Status is required')
], async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {id, newStatus} = req.body

    if(newStatus.toLowerCase() === 'ativo'){
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
    else if(newStatus.toLowerCase() === 'inativo'){
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
            message: 'newStatus invalid'
        })
    }
})


// Endpoint: /librian/get-all-collaborators (GET)
// Descrição: Retorna todos os colaboradores
router.get('/all-collaborators', async (req, res) => {
    try {
        const result = await db.getAllCollaborators()

        if(result.length > 0){
            res.status(200).json({
                message: 'Collaborators found',
                data: result
            })
        } else{
            res.status(204).json({
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
// Descrição: Retorna todos os colaboradores ativos
router.get('/collaborators-active', async (req, res) => {
    try {
        const result = await db.getActivatedCollaborators()

        if(result.length > 0){
            res.status(200).json({
                message: 'Collaborators found',
                data: result
            })
        } else{
            res.status(204).json({
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
// Descrição: Retorna todos os colaboradores inativos
router.get('/collaborators-inactive', async (req, res) => {
    try {
        const result = await db.getDesactivatedCollaborators()

        if(result.length > 0){
            res.status(200).json({
                message: 'Collaborators found',
                data: result
            })
        } else{
            res.status(204).json({
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