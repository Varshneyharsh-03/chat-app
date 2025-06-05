"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
let userCount = 0;
let Allsockets = [];
const wss = new ws_1.WebSocketServer({ port: 9090 });
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        try {
            const data = JSON.parse(message.toString());
            if (data.type === "join") {
                const user = {
                    socket: socket,
                    room: data.room,
                };
                Allsockets.push(user);
                userCount++;
                console.log(`User joined room ${data.room}. Total users: ${userCount}`);
            }
            else if (data.type === "chat") {
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
        }
        catch (err) {
            console.error("Failed to parse message:", err);
        }
    });
});
