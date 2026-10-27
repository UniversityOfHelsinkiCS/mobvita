const { DatabaseSync } = require('node:sqlite')
const { axios } = require('#util/common')

const wordCountLimit = 5000

// Estimates a text's difficulty, limiting each IP to `wordCountLimit` words a day (kept in SQLite).
const estimate = async (req, res) => {
  const { ip } = req
  const { text } = req.body

  if (!text) {
    res.status(400).json({ error: 'Text is required' })
    return
  }

  const wordCount = text.trim().split(/\s+/).length

  let db
  try {
    db = new DatabaseSync('estimate.db')
    db.exec('CREATE TABLE IF NOT EXISTS users (ip TEXT, word_count INTEGER, last_reset INTEGER)')
    const user = db.prepare('SELECT * FROM users WHERE ip = ?').get(ip)

    if (!user) {
      if (wordCount > wordCountLimit) {
        res
          .status(400)
          .json({ error: `This estimate exceeds the daily limit of ${wordCountLimit} words` })
        return
      }

      db.prepare('INSERT INTO users(ip, word_count, last_reset) VALUES(?, ?, ?)').run(
        ip,
        wordCount,
        Date.now(),
      )
    } else {
      let totalWordCount = wordCount + user.word_count
      let lastReset = user.last_reset

      if (Date.now() - lastReset >= 24 * 60 * 60 * 1000) {
        totalWordCount = wordCount
        lastReset = Date.now()
      }

      if (totalWordCount > wordCountLimit) {
        res
          .status(400)
          .json({ error: `This estimate exceeds the daily limit of ${wordCountLimit} words` })
        return
      }

      db.prepare('UPDATE users SET word_count = ?, last_reset = ? WHERE ip = ?').run(
        totalWordCount,
        lastReset,
        ip,
      )
    }
  } catch (error) {
    console.error(error.message)
  } finally {
    // Also closes after the early limit responses, which previously left the database open.
    db?.close()
  }

  const estimatorHost =
    process.env.ENVIRONMENT === 'development' ? 'http://localhost' : 'http://svm-58.cs.helsinki.fi'
  const scoreResponse = await axios.post(`${estimatorHost}:5000/predict_score`, { text })
  const cefrResponse = await axios.post(`${estimatorHost}:5000/predict_level`, { text })
  const featureResponse = await axios.post(`${estimatorHost}:5001/infer_reg_difficulty`, {
    text,
    language: 'Finnish',
  })

  res.json({
    score: scoreResponse.data.score,
    cefr: cefrResponse.data.level,
    level: featureResponse.data.level,
    explanation: featureResponse.data.explanation,
  })
}

module.exports = { estimate }
