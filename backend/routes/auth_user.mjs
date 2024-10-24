import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import userFunctions from '../docs/mongoUsers.mjs'


//updated shema: 
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// JWT secret key (use dotenv to store the secret key)
const JWT_SECRET = process.env.JWT_SECRET || 'wery_new_jwt_secret_key';

const router = express.Router();

// User registration route
router.post('/register', async (req, res) => {
    console.log("in register route")
    const { username, password } = req.body;
    console.log("in register route")
    try {
        // Check if the user already exists
        console.log("in register route")
        const existingUser = await userFunctions.getUser(username);

        //console.timeEnd("DB query time");
    console.log("in register route")
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

        // Set the token in a cookie to reduse riak of XSS atack 
        // and to send token automaticaly, so reduse complicated code
        res.cookie('token', token, {
            httpOnly: true, // Prevent access to the token via JavaScript
            secure: process.env.NODE_ENV === 'production', // Send cookies over HTTPS only in production
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000, // Token expires in 1 hour (same as the token expiry)
        });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error });
    }
});

// add loguot route to remove token from cookies
router.post('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the token cookie
    res.json({ message: 'Logged out successfully' });
});
// User fegister route
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

// Middleware to protect routes (extract autentication token from headers)
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