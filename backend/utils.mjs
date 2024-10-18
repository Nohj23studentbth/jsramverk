import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const utils = {
    // Middleware to protect routes
    authToken: function authenticateToken (req, res, next) {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) return res.status(401).json({ message: 'Access denied' });

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: 'Invalid token' });
            req.user = user;
            next();
        });
    },
    localBackend: "http://localhost:3000",

}

export default utils;
