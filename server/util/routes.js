const Router = require('express')
const stories = require('@controllers/storiesController')
const snippets = require('@controllers/snippetsController')
const session = require('@controllers/sessionController')
const translation = require('@controllers/translationController')
const opponent = require('@controllers/opponentController')
const user = require('@controllers/userController')

const router = Router()

router.get('/', (req, res) => res.send('welcome to root'))

router.get('/stories/:language', stories.getAll)
router.get('/stories/:language/:id', stories.getOne)
router.post('/stories', stories.createOne)

router.get('/snippets/story/:storyId/current', snippets.getCurrent)
router.get('/snippets/story/:storyId/next', snippets.getNext)
router.post('/snippets/story/:storyId/reset', snippets.reset)
router.post('/snippets/story/:storyId/answer', snippets.postAnswers)

router.get('/translation/:locale/:language/:wordLemmas', translation.getTranslation)

router.get('/opponent', opponent.getOpponent)

router.post('/session', session.create)

router.get('/user', user.getSelf)

module.exports = router
