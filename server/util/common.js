const common = require('@root/config/common')

const DB_URL = process.env.DB_URL || ''
const PORT = process.env.PORT || 8000

module.exports = {
  ...common,
  DB_URL,
  PORT,
}
