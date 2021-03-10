/* eslint-disable */
require('regenerator-runtime/runtime')
const httpm = require('@actions/http-client')

describe('basics', () => {
  beforeEach(() => {
    _http = new httpm.HttpClient('http-client-tests')
  })

  afterEach(() => {})

  it('constructs', () => {
    let http = new httpm.HttpClient('thttp-client-tests')
    expect(http).toBeDefined()
  })

  // responses from httpbin return something like:
  // {
  //     "args": {},
  //     "headers": {
  //       "Connection": "close",
  //       "Host": "httpbin.org",
  //       "User-Agent": "typed-test-client-tests"
  //     },
  //     "origin": "173.95.152.44",
  //     "url": "https://httpbin.org/get"
  //  }

  it('health check returns OK', async done => {
    let res = await _http.get('https://revita-old.cs.helsinki.fi/api/status')
    expect(res.message.statusCode).toBe(200)
    let body = await res.readBody()
    let obj = JSON.parse(body)
    expect(obj.message).toBe('OK')
    done()
  })
})
