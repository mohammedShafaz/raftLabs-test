import jwt from 'jsonwebtoken';
import { JwtPayload } from './interfaces';
import config from '../config/config';

export function verifyToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, config.jwtSecret) as JwtPayload;
    } catch (error) {
        console.error('Invalid or expired token:', error);
        return null;
    }
}
