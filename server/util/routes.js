const Router = require('express')
const stories = require('@controllers/storiesController')

const router = Router()

router.get('/', (req, res) => res.send('welcome to root'))

router.get('/stories', stories.getAll)
router.get('/stories/:id', stories.getOne)

module.exports = router
