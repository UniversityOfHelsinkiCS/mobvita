const path = require('path')
const express = require('express')
const routes = require('@util/routes')
const errorMiddleware = require('@middleware/errorMiddleware')
const headers = require('@middleware/headerMiddleware')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const fileCheck = require('@middleware/fileCheckMiddleware')

const swaggerDocument = YAML.load('./swagger.yaml')
const app = express()

const distPath = path.join(__dirname, '..', 'dist')

app.use(express.json({ limit: '10mb' }))
app.use(fileCheck)
app.use(headers)

app.use('/swag', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.static(distPath))
app.use(routes)

app.get('*', (req, res) => {
  return res.sendFile(path.join(distPath, 'index.html'))
})

app.use(errorMiddleware)

module.exports = app