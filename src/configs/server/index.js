const http = require('http')
const https = require('https')
const fs = require('fs')
const PrettyError = require('pretty-error')

// Get env
const vars = require('../vars')

// Error parser
const pe = new PrettyError()

module.exports = (app) => {
  let server
  let port = vars.port

  // Check if current env is in production
  if(vars.env == "production") {
    // Check if user didn't entered ssl key info
    if(!vars.ssl.key) {
      console.log(pe.render(new Error("Please give correct ssl key location")))
      process.exit(0)
    }
    // Check if user didn't entered ssl cert info
    if(!vars.ssl.cert) {
      console.log(pe.render(new Error("Please give correct ssl certificate location")))
      process.exit(0)
    }

    // Check if ssl key and certificate exists
    if(vars.ssl.key && vars.ssl.cert) {
      if(!fs.existsSync(vars.ssl.key)) {
        console.log(pe.render(new Error("Please give correct ssl key location")))
      }
      if(!fs.existsSync(vars.ssl.cert)) {
        console.log(pe.render(new Error("Please give correct ssl certificate location")))
        process.exit(0)
      }
    }

    // Create SSL Server
    server = https.createServer({
      key: fs.readFileSync(vars.ssl.key),
      cert: fs.readFileSync(vars.ssl.cert)
    }, app)
    port = 443
  }
  else {
    // Create http server
    server = http.createServer(app)
  }

  return { server, port }
}
