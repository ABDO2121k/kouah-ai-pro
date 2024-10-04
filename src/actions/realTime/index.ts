"use server";

import { Server } from "socket.io";

let io: Server;
//eslint-disable-next-line
export function initializeSocket(server: any) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });
    //eslint-disable-next-line
    io.on("connection", (socket: any) => {
      console.log("A user connected");
      //eslint-disable-next-line
      socket.on("join", (room: any) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
      });
    //eslint-disable-next-line
      socket.on("leave", (room:any) => {
        socket.leave(room);
        console.log(`User left room: ${room}`);
      });
     //eslint-disable-next-line
      socket.on("send_message", (data:any) => {
        io.to(data.room).emit("realtime-mode", { chat: data.message });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  }
  return io;
}
