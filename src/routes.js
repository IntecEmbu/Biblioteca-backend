import express from "express"
import cataloguingController from './controllers/cataloguingController.js'

const router = express.Router()


router.use('/cataloguin', cataloguingController)

router.use('/*', (req, res) => {
    res.status(404).json({
        notfound: 'verify on github the endpoints',
        by: '@blibion'
    })
})

export default router