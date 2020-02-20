const express = require('express')
const routes = require('@util/routes')
const errorMiddleware = require('@middleware/errorMiddleware')

const headers = require('@middleware/headerMiddleware')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')

const swaggerDocument = YAML.load('./swagger.yaml')

const app = express()

app.use(express.json({ limit: '10mb' }))
app.use(headers)
app.use('/swag', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(routes)

app.use(errorMiddleware)

module.exports = app
