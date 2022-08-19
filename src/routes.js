import express from "express"
import books from './controllers/BookController.js'
import librian from './controllers/LibrianController.js'

const router = express.Router()

router.use('/book', books)
router.use('/librian', librian)

router.use('*', (req, res) => {
    res.status(404).json({
        notfound: 'Verifique os endpoints',
        url: req.originalUrl,
        method: req.method
    })
})

export default router
