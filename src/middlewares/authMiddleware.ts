import jwt from 'jsonwebtoken';
import {  Response, NextFunction } from 'express';
import { CustomRequest } from '../utils/interfaces';
import config from '../config/config';


const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized !, Please login' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
    try {
        const decoded = jwt.verify(token, config.jwtSecret as string);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden' });
    }
};


export default authMiddleware;