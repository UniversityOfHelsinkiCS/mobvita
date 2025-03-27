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
    await db.exec('CREATE TABLE IF NOT EXISTS users (ip TEXT, word_count INTEGER)')
    const user = await db.get('SELECT * FROM users WHERE ip = ?', ip)
    const totalWordCount = user ? wordCount + user.word_count : wordCount

    if (totalWordCount > wordCountLimit) {
      res.status(400).json({ error: `You have exceeded the word limit of ${wordCountLimit}` })
      return
    }

    if (!user) {
      await db.run('INSERT INTO users(ip, word_count) VALUES(?, ?)', [ip, wordCount])
    } else {
      await db.run('UPDATE users SET word_count = word_count + ? WHERE ip = ?', [wordCount, ip])
    }

    await db.close()
  } catch (error) {
    console.error(error.message)
  }

  res.json({ difficulty: wordCount })
}

module.exports = { estimate }
