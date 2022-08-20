import express from 'express'
import db from '../services/UserService.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Endpoint: /user/insert-user (POST)
// Descrição: Cadastra um usuario no banco de dados
router.post('/insert-user',[
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

    if(type != 'Aluno' || type != 'Funcionario'){
        return res.status(400).json({
            message: 'Type must be Aluno or Funcionario'
        })
    }

    try {
        await db.createUser({name, email, type, phone, course})
        res.status(200).json({
            message: 'User inserted successfully'
        })
    } catch(error){
        return res.status(500).json({
            DatabaseError: error.message
        })
    }
})