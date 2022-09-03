import express from 'express'
import db from '../services/UserService.js'
import { body, validationResult } from 'express-validator'
import welcomeUser from '../email/welcomeUser.js'

const router = express.Router()

// Endpoint: /user/insert-user (POST)
// Descrição: Cadastra um usuario no banco de dados
router.post('/insert',[
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').not().isEmpty().withMessage('Email is required'),
    body('type').not().isEmpty().withMessage('Type is required'),
    body('phone').not().isEmpty().withMessage('Phone is required'),
    body('course').not().isEmpty().withMessage('Course is required')
], async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {name, email, type, phone, course} = req.body

    // Verifica se o tipo de usuario é valido
    if(!(type == 'Aluno' || type == 'Funcionario')){
        return res.status(400).json({
            message: 'Type must be Aluno or Funcionario',
            type: type
        })
    }

    try {
        await db.createUser({name, email, type, phone, course})
        res.status(200).json({
            message: 'User inserted successfully'
        })
        welcomeUser(name, email) // Envia email para o usuário
    } catch(error){
        res.status(500).json({
            DatabaseError: error.message
        })
    }
})

// Endpoint: /user/get-all (GET)
// Descrição: Coleta todos os usuarios cadastrados
router.get('/get-all', async (req, res) => {
    try {
        const users = await db.getAllUsers()
        res.status(200).json({
            users
        })
    } catch(error){
        return res.status(500).json({
            DatabaseError: error.message
        })
    }
})

// Endpoint: /user/search-user (GET)
// Descrição: Pesquisa usuarios pelo nome
router.get('/search-user', async (req, res) => {
    const {name} = req.query

    try {
        const users = await db.searchUserByName(name)
        res.status(200).json({
            users
        })
    } catch(error){
        return res.status(500).json({
            DatabaseError: error.message
        })
    }
})

export default router