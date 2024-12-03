import { Server } from "socket.io";
import { initializeSocketEvents } from "./events";


let io: Server | null = null

export function initializeSocketServer(httServer: any): Server {
    io = new Server(httServer, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST'],
        }
    });
    initializeSocketEvents(io);
    return io;
}

export { io };

