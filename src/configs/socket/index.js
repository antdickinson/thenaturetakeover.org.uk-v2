const functions = require('../functions')
const client = new Map()
const admins = new Map()
// Track last activity time for each client
const clientActivity = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    // Helper: update activity timestamp
    function updateActivity() {
      if (socket.isClient) {
        clientActivity.set(socket.id, Date.now());
      }
    }

    // Inactivity timer (5 minutes)
    let inactivityInterval = setInterval(() => {
      if (socket.isClient && clientActivity.has(socket.id)) {
        const last = clientActivity.get(socket.id);
        if (Date.now() - last > 30 * 1000) { // 30 seconds
          // Remove from admin and disconnect
          functions.removeClientAdmin(admins, { id: socket.id });
          if (client.has(socket.id)) client.delete(socket.id);
          clientActivity.delete(socket.id);
          try { socket.disconnect(true); } catch (e) {}
        }
      }
    }, 60 * 1000); // Check every minute

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
      updateActivity();
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
        clientActivity.delete(socket.id);
      }
      if(client.has(socket.id)) {
        client.delete(socket.id)
      }
      clearInterval(inactivityInterval);
    })

    // Client sending dragging image offsets
    socket.on('imageChange', function(d) {
      d.id = socket.id
      functions.updateImageChangeAdmin(admins, d)
      updateActivity();
    })

    // Client inactive for 60 seconds
    socket.on('inactive', function(d) {
      if(!d) {
        d = {}
      }
      d.id = socket.id
      functions.removeClientAdmin(admins, { id: socket.id })
      clientActivity.delete(socket.id);
      try { socket.disconnect(true); } catch (e) {}
    })

    // Reset activity on mouse/key events (if sent from client)
    socket.on('mouse', function() {
      updateActivity();
    });
    socket.on('keypress', function() {
      updateActivity();
    });
  })
}
