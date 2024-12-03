import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/auth';

export function authenticateSocket(socket: Socket, next: (err?: Error) => void): void {
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new Error("Authentication error: No token provided"));
    }

    try {
        const user = verifyToken(token);
        if (!user) {
            return next(new Error("Authentication error: Invalid token"));
        }

        socket.data.user = user;
        next();
    } catch (error) {
        return next(new Error("Authentication error: Invalid token"));
    }
}
