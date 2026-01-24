const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- FIXED CORS CONFIGURATION ---
app.use(cors({
    origin: 'http://localhost:8080', // Allow your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); 

// --- JSON PARSING MIDDLEWARE ---
// Increased limit to 10mb to handle Base64 Profile Pictures smoothly
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- REQUEST LOGGER ---
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} to ${req.url}`);
    next();
});

// --- REGISTER ALL ROUTES ---

// 1. Auth Routes (Login, Register, Profile Updates)
app.use('/api/auth', require('./routes/authRoutes'));

// 2. Placement Routes (Ticker, All Drives, Stats, Apply)
// Registered as /api/placements
app.use('/api/placements', require('./routes/placement'));

// 3. Student Specific Routes (Dashboard Stats, etc.)
const { verifyRole } = require('./middleware/authMiddleware');
app.use('/api/student', verifyRole('student'), require('./routes/studentRoutes'));

// 4. Other Module Routes
app.use('/api/subs', require('./routes/subRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// --- STATIC FILES ---
// This makes the 'uploads' folder accessible via URL
app.use('/uploads', express.static('uploads'));

// --- GLOBAL ERROR HANDLER ---
// Prevents the server from crashing on unexpected errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong on the server!' });
});

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('🚀 SmartCampus Backend is running on port 5000');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is sprinting on http://localhost:${PORT}`);
});