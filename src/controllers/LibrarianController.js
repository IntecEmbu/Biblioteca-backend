import express from 'express'
import db from '../services/LibrarianService.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Endpoint: /librarian/insert-collaborator (POST)
// Descrição: Cadastra um colaborador no banco de dados
router.post('/insert-collaborator',[
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').not().isEmpty().withMessage('Email is required'),
    body('password').not().isEmpty().withMessage('Password is required'),
    body('user').not().isEmpty().withMessage('User is required')
], async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    
    const {name, email, user, password} = req.body

    try {
        await db.createCollaborator({name, email, user, password})
        res.status(200).json({
            message: 'Voluntary inserted successfully'
        })
    } catch(error){
        return res.status(500).json({
            DatabaseError: error.message
        })
    }
})

// Endpoint: /librarian/login-collaborator (POST)
// Descrição: Login de um colaborador no sistema
router.post('/login-collaborator',[
    body('user').not().isEmpty().withMessage('User is required'),
    body('password').not().isEmpty().withMessage('Password is required')
], async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {user, password} = req.body

    try{
        const result = await db.loginCollaborator({user, password})

        if(result.length > 0){
            res.status(200).json({
                message: 'Login successful',
                data: result
            })
        } else{
            res.status(401).json({
                message: 'Login failed'
            })
        }
    } catch(error){
        return res.status(500).json({
            DatabaseError: error.message
        })
    }
})

// Endpoint: /librarian/status-collaborator (POST)
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


// Endpoint: /librarian/get-all-collaborators (GET)
// Descrição: Retorna todos os colaboradores
router.get('/all-collaborators', async (req, res) => {
    try {
        const result = await db.getAllCollaborators()

        if(result.length > 0){
            res.status(200).json({
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

// Endpoint: /librarian/get-collaborator-active (GET)
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

// Endpoint: /librarian/get-collaborator-inactive (GET)
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
