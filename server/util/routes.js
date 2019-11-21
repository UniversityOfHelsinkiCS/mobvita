const Router = require('express')
const stories = require('@controllers/storiesController')
const snippets = require('@controllers/snippetsController')
const session = require('@controllers/sessionController')
const translation = require('@controllers/translationController')

const router = Router()

router.get('/', (req, res) => res.send('welcome to root'))

router.get('/stories/:language', stories.getAll)
router.get('/stories/:language/:id', stories.getOne)
router.post('/stories', stories.createOne)

router.get('/snippets/story/:storyId/current', snippets.getCurrent)
router.post('/snippets/story/:storyId/reset', snippets.reset)
router.post('/snippets/story/:storyId/answer', snippets.postAnswers)

router.get('/translation/:locale/:language/:wordLemmas', translation.getTranslation)

router.post('/session', session.create)

module.exports = router
