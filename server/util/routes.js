const Router = require('express')
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage })

const { checkRevitaStatus } = require('@controllers/healthCheckController')
const proxyController = require('@controllers/proxyController')
const { getYandexTTS, getFinTTS, getEngTTS } = require('@controllers/ttsController')
const { estimate } = require('@controllers/estimateController')

const router = Router()

router.get('/revitaStatus', checkRevitaStatus)
router.get('/fin_tts', getFinTTS)
router.get('/eng_tts', getEngTTS)
router.get('/yandex_tts', getYandexTTS)

router.post('/ctxTranslate', proxyController.mtProxyPost)
router.get('/mtStatus', proxyController.mtStatus)

router.post('/estimate', estimate)

router.get('/', (_req, res) => res.send('welcome to root'))

router.post('/file/*', upload.single('file'), proxyController.proxyFilePost)

router.get('/*', proxyController.proxyGet)
router.post('/*', proxyController.proxyPost)


module.exports = router
