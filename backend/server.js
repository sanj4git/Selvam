import express from 'express';
import cron from 'node-cron';
import { syncValuations } from './controllers/valuationController.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import assetRoutes from "./routes/assetRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import liabilityRoutes from "./routes/liabilityRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import familyRoutes from "./routes/familyRoutes.js";
import cors from 'cors';


dotenv.config();    // load .env variables

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Middleware to parse JSON coming in
app.use(express.json());

// Register Route
app.use("/api/auth", authRoutes);

// Family Routes
app.use("/api/family", familyRoutes);

// Asset Routes
app.use("/api/assets", assetRoutes);

app.use("/api/expenses", expenseRoutes);

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

// Schedule Asset Valuation Sync (Every day at midnight)
cron.schedule('0 0 * * *', () => {
  syncValuations();
});
console.log("Scheduled Task: Daily Asset Valuation Sync [0 0 * * *]");

app.listen(PORT, () => console.log(`Server running at ${PORT}`));