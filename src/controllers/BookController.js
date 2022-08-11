import express from 'express'
import db from '../services/BookService.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Endpoint: /book/insert (POST)
// Description: Insert a new book
router.post('/insert',[
    body('title').not().isEmpty().withMessage('Title is required'),
    body('edition').not().isEmpty().withMessage('Edition is required'),
    body('isbn').not().isEmpty().withMessage('ISBN is required'),
    body('year').not().isEmpty().withMessage('Year is required'),
    body('category').not().isEmpty().withMessage('Category is required'),
    body('cdd').not().isEmpty().withMessage('CDD is required'),
    body('idiom').not().isEmpty().withMessage('Idiom is required'),
    body('publisher_name').not().isEmpty().withMessage('Publisher name is required')
], async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            error: errors.array()
        })
    }

    const {title, edition, isbn, year, category, cdd, idiom, publisher_name} = req.body

    try {
        await db.insertBook({title, edition, isbn, year, category, cdd, idiom, publisher_name})
        res.status(200).json({
            message: 'Book inserted successfully'
        })
    } catch (error) {
        return res.status(500).json({
            DatabaseError: error.message
        })
    }
})

// Endpoint: /book/all (GET)
// Description: Get all books
router.get('/all', async (req, res) => {
    try {
        const results = await db.getAllBooks()

        if (results.length === 0){
            return res.status(404).json({
                message: 'No books found'
            })
        }

        res.status(200).json({
            books: results
        })

    } catch (error) {
        return res.status(500).json({
            DatabaseError: error.message
        })
    }
})


// Endpoint: /book/all-count (GET)
// Description: Get all books count
router.get('/all-count', async (req, res) => {
    try {
        const results = await db.getCountBooks()

        res.status(200).json({
            count: results[0].total
        })

    } catch (error) {
        return res.status(500).json({
            DatabaseError: error.message
        })
    }
})

// Endpoint: /book/all-category (GET)
// Description: Get all category registered
router.get('/all-category', async (req, res) =>{
    try {
        const results = await db.getAllCategory()

        if (results.length === 0){
            return res.status(404).json({
                message: 'No category found'
            })
        }
        
        return res.status(200).json({
            category: results
        })
    } catch (error) {
        return res.status(500).json({
            DatabaseError: error.message
        })
    }
})

export default router