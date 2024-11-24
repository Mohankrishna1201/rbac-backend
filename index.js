const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://21ee01037:xzijgYH3ABETU1y7@cluster0.grkk4.mongodb.net/')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Route setup
app.use('/api/users', userRoutes);
app.use('/api/admin', roleRoutes);  // Admin functionalities
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
