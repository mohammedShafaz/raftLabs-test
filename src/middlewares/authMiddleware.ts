import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { CustomRequest, JwtPayload } from '../utils/interfaces';
import config from '../config/config';


const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token missing or malformed.' });
    }
    try {
        const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
};


export default authMiddleware;