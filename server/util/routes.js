const Router = require('express')
const stories = require('@controllers/storiesController')
const snippets = require('@controllers/snippetsController')
const session = require('@controllers/sessionController')

const router = Router()

router.get('/', (req, res) => res.send('welcome to root'))

router.get('/stories', stories.getAll)
router.get('/stories/:id', stories.getOne)

router.get('/snippets/story/:storyId/current', snippets.getCurrent)
router.post('/snippets/story/:storyId/reset', snippets.reset)
router.post('/snippets/story/:storyId/answers', snippets.getAnswers)

router.post('/session', session.create)

module.exports = router
