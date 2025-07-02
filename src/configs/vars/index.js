require('dotenv').config()

let p = process.env

module.exports = {
  env: p.ENV,
  port: (p.DEV_PORT) ? p.DEV_PORT : 3000,
  ssl: {
    key: p.SSL_KEY,
    cert: p.SSL_CERT
  }
}
