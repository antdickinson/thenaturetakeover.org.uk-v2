const functions = require('../functions')
const client = new Map()
const admins = new Map()

module.exports = (io) => {
  io.on('connection', (socket) => {
    // Client interface
    socket.on('client', () => {
      let check = client.has(socket.id)
      socket.isClient = true
      socket.isAdmin = false
      if(!check) {
        client.set(socket.id, socket)
        let url = socket.request.headers.referer
        let image = functions.getRandomImage(url) // get random image link and send url with it (to send download link)
        let item = { id: socket.id, image }
        socket.emit('image', { image })
        functions.updateAdminWithImages(admins, item)
      }
    })

    // Admin Interface
    socket.on('admin', () => {
      let check = admins.has(socket.id)
      socket.isAdmin = true
      socket.isClient = false
      if(!check) {
        admins.set(socket.id, socket)
      }
    })

    // if client is disconnected
    socket.on('disconnect', function(){
      if(socket.isClient) {
        functions.removeClientAdmin(admins, { id: socket.id })
      }
      if(client.has(socket.id)) {
        client.delete(socket.id)
      }
    })

    // Client sending dragging image offsets
    socket.on('imageChange', function(d) {
      d.id = socket.id
      functions.updateImageChangeAdmin(admins, d)
    })

    // Client inactive for 60 seconds
    socket.on('inactive', function(d) {
      if(!d) {
        d = {}
      }
      d.id = socket.id
      functions.removeClientAdmin(admins, { id: socket.id })
    })
  })
}
