const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- FIXED CORS CONFIGURATION ---
app.use(cors({
    origin: 'http://localhost:8080', // Allow your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow PUT
    allowedHeaders: ['Content-Type', 'Authorization']
})); 

// --- JSON PARSING MIDDLEWARE ---
// This must be above the routes to prevent "req.body is undefined" errors
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- REQUEST LOGGER ---
// This will print every click to your terminal so you can see it working
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} to ${req.url}`);
    next();
});

// --- REGISTER ALL ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/student', require('./middleware/authMiddleware').verifyRole('student'), require('./routes/studentRoutes'));
app.use('/api/subs', require('./routes/subRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('🚀 SmartCampus Backend is running on port 5000');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is sprinting on http://localhost:${PORT}`);
});