
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();    // load .env variables

const app = express();

// Middleware to parse JSON coming in
app.use(express.json());

// Mongo Connection
mongoose.connect(process.env.MONGO_URI)

.then(() => console.log("Mongo DB Connected Successfully!"))
.catch((err) => console.error("MongoDB Connection error : ", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at ${PORT}`));