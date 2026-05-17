import express from "express";
import { get_db } from "../db.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

const error_email_exists = "Email already exists";

async function create_user(db, email, password) {
    return new Promise((resolve, reject) => {
        const query_check_email = "SELECT id FROM users WHERE email = ?";

        db.get(query_check_email, email, async (err, existing) => {
            if (err) {
                console.error(err);
                return reject(new Error(`Database error while checking existing email: ${err.message}`));
            }
            
            if (existing) {
                return reject(new Error(error_email_exists));
            }

            const password_hash = await bcryptjs.hash(password, 10);
            const query_insert = "INSERT INTO users (email, password_hash) VALUES (?, ?)";
            
            db.run(query_insert, [email, password_hash], function(err) {
                if (err) {
                    console.error(err);
                    return reject(new Error(`Database error while inserting user: ${err.message}`));
                }

                console.log(`Inserted user with ID ${this.lastID}`);

                const created_user = {
                    id: this.lastID,
                    email
                };

                resolve(created_user);
            });
        });
    });
}

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { email, password } = req.body || {};
    
    if (!email || !password) {
        return res.status(400).json({ error: "email and password required" });
    }

    const db = get_db();

    try {
        const user = await create_user(db, email, password);
        return res.status(201).json({ id: user.id, email: user.email });
    } catch (err) {
        if (err.message === error_email_exists) {
            return res.status(409).json({ error: err.message });
        }

        return res.status(500).json({ error: err.message });
    }
});

async function login_user(db, email, password) {
    return new Promise((resolve, reject) => {
        const query = "SELECT id, email, password_hash FROM users WHERE email = ?";
        db.get(query, email, async (err, user) => {
            if (err) {
                console.error(err);
                return reject(new Error(`Database error while fetching user: ${err.message}`));
            }

            if (!user) {
                return reject(new Error("Invalid email or password"));
            }

            const password_match = await bcryptjs.compare(password, user.password_hash);
            if (!password_match) {
                return reject(new Error("Invalid email or password"));
            }

            console.log(`User ${user.email} authenticated successfully`);
            console.log(`Generating JWT for user ID ${user.id}`);

            const token = jwt.sign(
                { sub: user.id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            resolve({ token });
        });
    });
}

router.post("/login", async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ error: "email and password required" });
    }

    const db = get_db();

    try {
        const result = await login_user(db, email, password);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(401).json({ error: err.message });
    }
});

export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authorization header missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`JWT verified successfully for user ID ${decoded.sub}`);
        req.user = { id: decoded.sub, email: decoded.email };
        next();
    } catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

export default router;