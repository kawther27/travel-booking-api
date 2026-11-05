import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Utilisateur from '../Models/Utilisateur.js';
import Role from '../Models/Role.js';




const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log(token)

            const decoded = jwt.verify(token, 'admin');

            req.user = await Role.findOne({
                where: {
                    id: decoded.id,
                },
            });

            console.log(decoded.id);
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const userMiddleware = asyncHandler(async (req, res, next) => {
    console.log(Utilisateur.roleId);
    if (Utilisateur.roleId === 2) {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied: User role required.' });
    }
});

const adminMiddleware = asyncHandler(async (req, res, next) => {
    if (Utilisateur.roleId === 1) {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied: Admin role required.' });
    }
});

export { authMiddleware, userMiddleware, adminMiddleware };
