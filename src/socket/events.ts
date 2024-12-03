import { Server, Socket } from "socket.io";
import { authenticateSocket } from "../middlewares/socketMiddleware";
import Message from "../models/message.model";
import Room from "../models/rooms.model";

export function initializeSocketEvents(io: Server): void {
    io.use(authenticateSocket);
    io.on('connection', (socket: Socket) => {
    
        console.log('A user connected', socket.id);
        
        socket.on('joinRoom', async (roomId: string) => {
            try {
                const room = await Room.findById(roomId)
                if (room && room.participants.includes(socket.data.user._id)) {
                    socket.join(roomId);
                    console.log(`User joined room: ${roomId}`);
                } else {
                    console.log(`Room not found or user not authorized to join`);
                }
            } catch (error) {
                console.error('Error joining room:', error);
                socket.emit('error', 'Failed to join room');
            }
        });

        socket.on("sendMessage", async (messageContent: string, roomId: string) => {
            const room = await Room.findById(roomId);
            if (!room) {
                return socket.emit("error", "Room not found");
            }

            const newMessage = new Message({
                sender: socket.data.user._id,
                room: roomId,
                content: messageContent,
            });

            await newMessage.save();
            io.to(roomId).emit("receiveMessage", {
                user: socket.data.user._id,
                message: messageContent,
                room: roomId,
            });

            console.log(`Message sent to room ${roomId}: ${messageContent}`);
        });


        socket.on('disconnect', () => {
            console.log('User disconnected', socket.id);
        });
    });
}
