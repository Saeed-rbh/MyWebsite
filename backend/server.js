const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const CVSection = require('./models/CVSection'); // Ensure model is loaded
require('dotenv').config();

const app = express();

const cvRoutes = require('./routes/cvRoutes');
const authRoutes = require('./routes/authRoutes');
const scholarRoutes = require('./routes/scholarRoutes');
const User = require('./models/User'); // Register User model

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cv', cvRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/scholar', scholarRoutes);
app.use('/api/upload', require('./routes/uploadRoutes'));

// Serve uploads statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Academic CV Backend is running (SQLite)');
});

// Database Connection
sequelize.sync().then(() => {
    console.log("SQLite database connected and synced");
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
}).catch(err => {
    console.error("Database connection error:", err);
});
// Force restart 3
