import { WebSocketServer, WebSocket } from "ws";

interface User {
  socket: WebSocket;
  room: string;
}

let userCount = 0;
let Allsockets: User[] = [];

const wss = new WebSocketServer({ port: 9090 });

wss.on("connection", (socket) => {
  socket.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === "join") {
        const user: User = {
          socket: socket,
          room: data.room,
        };
        Allsockets.push(user);
        userCount++;
        console.log(`User joined room ${data.room}. Total users: ${userCount}`);
      } else if (data.type === "chat") {
        const user = Allsockets.find((u) => u.socket === socket);
        if (user) {
          const messageToSend = JSON.stringify({
            type: "chat",
            room: user.room,
            message: data.message,
          });

          Allsockets.forEach((u) => {
            if (u.room === user.room) {
              u.socket.send(messageToSend);
            }
          });
        }
      }
    } catch (err) {
      console.error("Failed to parse message:", err);
    }
  });
});
