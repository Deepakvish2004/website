const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());


connectDB(process.env.MONGO_URI);
const workerRoutes = require('./routes/workers');
app.use('/api/workers', workerRoutes);



// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));

const serviceRoutes = require("./routes/serviceRoutes");
app.use("/api/services", serviceRoutes);


const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/api/feedback', feedbackRoutes);

app.get('/', (req, res) => res.send('Urban Booking API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
