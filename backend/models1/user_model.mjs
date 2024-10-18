import express, { json } from 'express';
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Schema, model, connect } from 'mongoose';

// User model
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = model('User', UserSchema);

// JWT secret key
const JWT_SECRET = 'oleg22_jwt_secret_key';

const app = express();
app.use(json());

// User registration route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await hash(password, 10);

    try {
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
});

// User login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    // Generate JWT token
    const token = sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ message: 'Access denied' });

    verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Protected route to get documents (only accessible with a valid token)
app.get('/documents', authenticateToken, async (req, res) => {
    // Fetch documents from MongoDB
    const documents = await Document.find();
    res.json(documents);
});

connect('mongodb://localhost/yourdb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(3000, () => console.log('Server running on port 3000')))
    .catch((err) => console.log(err));
