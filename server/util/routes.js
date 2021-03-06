const Router = require('express')
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage })

const { checkRevitaStatus } = require('@controllers/healthCheckController')
const proxyController = require('@controllers/proxyController')


const router = Router()

router.get('/revitaStatus', checkRevitaStatus)

router.get('/', (_req, res) => res.send('welcome to root'))

router.post('/file/*', upload.single('file'), proxyController.proxyFilePost)

router.get('/*', proxyController.proxyGet)
router.post('/*', proxyController.proxyPost)


module.exports = router
