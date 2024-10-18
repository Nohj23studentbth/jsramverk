import express, { json } from 'express';
import { authenticateToken } from './auth.mjs';
import data from "../models/data.mjs";
import auth from "../models/auth.mjs";
import users from '../docs/mongoUsers.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Schema, model, connect } from 'mongoose';

// User model
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = model('User', UserSchema);
//import userSchema from './../db/mongo/db_schema.json' assert { type: 'json' };

// // Define your User schema (mongoose)
// const UserSchema = new mongoose.Schema(userSchema);
// const User = mongoose.model('User', UserSchema);

// JWT secret key (use dotenv to store the secret key)
const JWT_SECRET = process.env.JWT_SECRET || 'oleg22_wery_jwt_secret_key';


const router = express.Router();

//parse JSON bodies
router.use(express.json());

// get a user by name from a user as JSON
router.get("/:user",async(req, res) => {
    const user = reg.params.user;
    try {
        console.log("try in the GET docs/")
        const docs = await users.getUser(user);
        // res = {
        //     status: 200,
        //     user: user
        // }
        res.json(docs);
    } catch (error) {
        res.status(500).json({ message: 
            'Error fetching documents at backend/routes/mongoREmote.mjs' });
    }
});

export default router;