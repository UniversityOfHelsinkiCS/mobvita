const sqlite3 = require('sqlite3').verbose()
const { open } = require('sqlite')

const wordCountLimit = 100

const estimate = async (req, res) => {
  const { ip } = req
  const { text } = req.body

  if (!text) {
    res.status(400).json({ error: 'Text is required' })
    return
  }

  const wordCount = text.trim().split(/\s+/).length

  try {
    const db = await open({ filename: 'estimate.db', driver: sqlite3.Database })
    await db.exec(
      'CREATE TABLE IF NOT EXISTS users (ip TEXT, word_count INTEGER, last_reset INTEGER)'
    )
    const user = await db.get('SELECT * FROM users WHERE ip = ?', ip)

    if (!user) {
      if (wordCount > wordCountLimit) {
        res
          .status(400)
          .json({ error: `This estimate exceeds the daily limit of ${wordCountLimit} words` })
        return
      }

      await db.run('INSERT INTO users(ip, word_count, last_reset) VALUES(?, ?, ?)', [
        ip,
        wordCount,
        Date.now(),
      ])
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

      await db.run('UPDATE users SET word_count = ?, last_reset = ? WHERE ip = ?', [
        totalWordCount,
        lastReset,
        ip,
      ])
    }

    await db.close()
  } catch (error) {
    console.error(error.message)
  }

  res.json({ difficulty: wordCount })
}

module.exports = { estimate }
