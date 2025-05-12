/* eslint-disable */
require('regenerator-runtime/runtime')
const httpm = require('@actions/http-client')

describe('basics', () => {
  jest.setTimeout(30000)
  beforeEach(() => {
    _http = new httpm.HttpClient('http-client-tests')

    _http.requestOptions = {
      headers: {
        Authorization: process.env.REVITA_USER_TOKEN
      },
      socketTimeout: 30000
    }
  })

  afterEach(() => {})

  it('constructs', () => {
    let http = new httpm.HttpClient('thttp-client-tests')
    expect(http).toBeDefined()
  })

  it('health check returns OK', async done => {
    let res = await _http.get('https://revita-old.cs.helsinki.fi/api/status')
    expect(res.message.statusCode).toBe(200)
    let body = await res.readBody()
    let obj = JSON.parse(body)
    expect(obj.message).toBe('OK')
    done()
  })

  it('fetching next snippet works', async done => {
    let res = await _http.get('https://revita-old.cs.helsinki.fi/api/stories/5c08248cff63453c5424000b/snippets/next')
    expect(res.message.statusCode).toBe(200)
    let body = await res.readBody()
    let obj = JSON.parse(body)
    expect(obj.message).toBe('OK')
    done()
  })

  it('fetching flashcards works', async done => {
    let res = await _http.get('https://revita-old.cs.helsinki.fi/api/flashcards/Russian/English?')
    expect(res.message.statusCode).toBe(200)
    let body = await res.readBody()
    let obj = JSON.parse(body)
    expect(obj.message).toBe('OK')
    done()
  })
})
