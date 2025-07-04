const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const fs = require('fs')
const path = require('path')
const os = require('os')

// Get env
const vars = require('./configs/vars')

// Server creator
const serverCreator = require('./configs/server')

// Socket Controller
const socket = require('./configs/socket')

const app = express()



// Static resources
app.use('/static', express.static('./public'))

// Set templating engine
app.set('view engine', 'pug')

// Set default view folder
app.set('views', './views')

// Set ssl enabled (in case of proxy)
app.enable('trust proxy', function(ip) {
  console.log(ip)
  return true
})

const { server, port } = serverCreator(app)
const io = socketio(server)

// Attach controller
socket(io)

// render landing page
app.get('/', async (req, res, next) => {
  return res.render('index.pug');
})

// render Customer page
app.get('/customer', async (req, res, next) => {
  return res.render('customer.pug')
})

// render admin page
app.get('/admin', async (req, res, next) => {
  return res.render('admin.pug')
})

// Send image file
app.get('/image/:imageName', async (req, res, next) => {
  const filePath = path.resolve(__dirname, "../images/"+req.params.imageName)
  if(fs.existsSync(filePath)) {
    return res.sendFile(filePath)
  }
  else {
    return res.send("WRONG FILE")
  }
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Server is up on port ${port}!`)
  
  // Get all network interfaces
  const interfaces = os.networkInterfaces()
  console.log('\nAvailable network addresses:')
  
  Object.keys(interfaces).forEach((iface) => {
    interfaces[iface].forEach((details) => {
      // Only show IPv4 addresses that aren't internal
      if (details.family === 'IPv4' && !details.internal) {
        console.log(`  http://${details.address}:${port}`)
      }
    })
  })
  
  console.log('\nAccess from other devices using any of the above addresses')
})
