const Router = require('express')

const { checkRevitaStatus } = require('@controllers/healthCheckController')
const proxyController = require('@controllers/proxyController')


const router = Router()

router.get('/revitaStatus', checkRevitaStatus)

router.get('/', (_req, res) => res.send('welcome to root'))

router.get('/*', proxyController.proxyGet)
router.post('/*', proxyController.proxyPost)


module.exports = router
