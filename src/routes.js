import express from "express"
import books from './controllers/BookController.js'

const router = express.Router()

router.use('/books', books)

router.use('*', (req, res) => {
    res.status(404).json({
        notfound: 'verify on github the endpoints',
        by: '@BibliON'
    })
})

export default router
