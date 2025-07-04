module.exports = (admins, newSocketData) => {
  const adminObj = Object.fromEntries(admins)
  const sockets = Object.values(adminObj)
  for(let i = 0; i < sockets.length; i++) {
    const socket = sockets[i]
    socket.emit("imageChange", newSocketData)
  }
}
