"use server";

import { Server } from "socket.io";

let io: Server;

//eslint-disable-next-line
export async function initializeSocket(server: any) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("join", (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
      });

      socket.on("leave", (room) => {
        socket.leave(room);
        console.log(`User left room: ${room}`);
      });

      socket.on("send_message", (data) => {
        io.to(data.room).emit("realtime-mode", { chat: data.message });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  }
  // Return a boolean indicating whether the server was initialized
  return !!io;
}
