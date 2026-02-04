const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const helmet = require('helmet');
//const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authorize = require("./middlewares/authorize.middleware");
const authRoutes = require("./routes/auth.routes");

const app = express();

//app.set('trust proxy', true);

app.use(helmet());                           // headers securite
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '10kb' }));    // limite taille body
app.use(cookieParser());

// 100 requetes / 15 min global
//app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// 12 tentatives / 15 min sur login
//app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 12 }));


// Connect to MongoDB
connectDB().catch((err) => console.error(err));

// Middleware to parse JSON bodies
//app.use(express.json());

// Routes
app.use("/api/users", authorize("CLIENT"), userRoutes);
app.use("/api/auth", authRoutes)
module.exports = app;