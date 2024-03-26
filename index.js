require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const categoryRoutes = require('./routes/categoryRoutes');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Express middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/v1/categories', categoryRoutes);

// Error handling middleware
app.use(errorHandler);

// Check server helth
app.get('/', async (req, res) => { 
    try {
        res.status(200).send({message: "Surver is up!"})
    } catch (error) {
        res.status(500).send({message: "Server Faild!"})
    }
 })

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
