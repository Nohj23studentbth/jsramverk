import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import userFunctions from '../docs/mongoUsers.mjs'

// Define your User schema (mongoose)
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// JWT secret key (use dotenv to store the secret key)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const router = express.Router();

// User registration route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await userFunctions.getUser(username);

        //console.timeEnd("DB query time");

        // If the user already exists, return a 409 Conflict status with a descriptive message
        if (existingUser) {
            return res.status(409).json({
                ok: false,
                message: 'User already exists',
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // If the user does not exist, create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
        });

        // Save the user to the database
        const saveResponse = await userFunctions.saveUser(newUser);

        // Return success response
        return res.status(201).json({
            ok: true,
            message: 'User registered successfully',
            data: saveResponse,
        });

    } catch (error) {
        // Handle any server or database errors
        console.error("Error in /register:", error);

        // Send a 500 error with a specific error message
        return res.status(500).json({
            ok: false,
            message: 'Server error, please try again later.',
            error: error.message,  // Optional, but useful for debugging
        });
    }
});

// User login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userFunctions.getUser(username);

        console.log("user: ", user)
       
        if (!user) {

            console.log(user)
            return res.status(400).send({ message: 'No username found' });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) return res.status(400).send({ message: 'Invalid username or password' });

        // Generate JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error });
    }
});

// User login route
router.delete('/unregister', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userFunctions.getUser(username);
        if (!user) return res.status(400).json({ message: 'Invalid username or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

        const respons = await userFunctions.removeUser(username);

        res.json(respons);
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error });
    }
});

// Middleware to protect routes
export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

export default router;