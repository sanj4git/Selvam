import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import assetRoutes from "./routes/assetRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import liabilityRoutes from "./routes/liabilityRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();    // load .env variables

const app = express();

// Middleware to parse JSON coming in
app.use(express.json());

// Register Route
app.use("/api/auth", authRoutes);

// Asset Routes
app.use("/api/assets", assetRoutes);

app.use("/api/expenses",expenseRoutes);

//Liability Routes
app.use("/api/liabilities", liabilityRoutes);

//Dashboard Routes
app.use("/api/dashboard", dashboardRoutes);

// Mongo Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Mongo DB Connected Successfully!"))
.catch((err) => console.error("MongoDB Connection error : ", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at ${PORT}`));