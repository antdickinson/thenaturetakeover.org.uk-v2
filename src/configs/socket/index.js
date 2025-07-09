const functions = require('../functions')
const client = new Map()
const admins = new Map()
const clientActivity = new Map();
// Add new maps for the second group
const client2 = new Map();
const admins2 = new Map();
const client2Activity = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    // Helper: update activity timestamp
    function updateActivity() {
      if (socket.isClient) {
        clientActivity.set(socket.id, Date.now());
      }
      if (socket.isClient2) {
        client2Activity.set(socket.id, Date.now());
      }
    }

    // Inactivity timer (5 minutes)
    let inactivityInterval = setInterval(() => {
      if (socket.isClient && clientActivity.has(socket.id)) {
        const last = clientActivity.get(socket.id);
        if (Date.now() - last > 30 * 1000) { // 30 seconds
          functions.removeClientAdmin(admins, { id: socket.id });
          if (client.has(socket.id)) client.delete(socket.id);
          clientActivity.delete(socket.id);
          try { socket.disconnect(true); } catch (e) {}
        }
      }
      if (socket.isClient2 && client2Activity.has(socket.id)) {
        const last = client2Activity.get(socket.id);
        if (Date.now() - last > 30 * 1000) { // 30 seconds
          functions.removeClientAdmin(admins2, { id: socket.id });
          if (client2.has(socket.id)) client2.delete(socket.id);
          client2Activity.delete(socket.id);
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
        let image = functions.getRandomImage(url)
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

    // Client2 interface
    socket.on('client2', () => {
      let check = client2.has(socket.id)
      socket.isClient2 = true
      socket.isAdmin2 = false
      if(!check) {
        client2.set(socket.id, socket)
        let url = socket.request.headers.referer
        let image = functions.getRandomImage(url)
        let item = { id: socket.id, image }
        socket.emit('image', { image })
        functions.updateAdminWithImages(admins2, item)
      }
      updateActivity();
    })

    // Admin2 Interface
    socket.on('admin2', () => {
      let check = admins2.has(socket.id)
      socket.isAdmin2 = true
      socket.isClient2 = false
      if(!check) {
        admins2.set(socket.id, socket)
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
      if(socket.isClient2) {
        functions.removeClientAdmin(admins2, { id: socket.id })
        client2Activity.delete(socket.id);
      }
      if(client2.has(socket.id)) {
        client2.delete(socket.id)
      }
      clearInterval(inactivityInterval);
    })

    // Client sending dragging image offsets
    socket.on('imageChange', function(d) {
      d.id = socket.id
      if (socket.isClient2) {
        functions.updateImageChangeAdmin(admins2, d)
      } else {
        functions.updateImageChangeAdmin(admins, d)
      }
      updateActivity();
    })

    // Client inactive for 60 seconds
    socket.on('inactive', function(d) {
      if(!d) {
        d = {}
      }
      d.id = socket.id
      if (socket.isClient2) {
        functions.removeClientAdmin(admins2, { id: socket.id })
        client2Activity.delete(socket.id);
      } else {
        functions.removeClientAdmin(admins, { id: socket.id })
        clientActivity.delete(socket.id);
      }
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
