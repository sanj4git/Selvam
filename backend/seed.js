/**
 * seed.js — Selvam Demo Data Seeder
 *
 * Creates a complete demo user with realistic Indian household financial data:
 * - 1 demo user (Head of Family)
 * - 1 family
 * - 20 expenses across all categories (last 90 days)
 * - 7 assets (gold, FD, stocks, cash, real estate, mutual fund, crypto)
 * - 4 liabilities (home loan, car EMI, credit card, personal loan)
 *
 * Usage:
 *   node seed.js
 *
 * Login:
 *   Email: demo@selvam.in
 *   Password: Demo@1234
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// ── Models (inline schemas so we don't need to import full models) ──────────

const userSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String,
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: "Family", default: null },
  role: { type: String, enum: ["Head", "Member", "None"], default: "None" },
}, { timestamps: true });

const familySchema = new mongoose.Schema({
  name: String,
  joinCode: { type: String, unique: true },
  headUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number, category: String, date: Date, description: String,
}, { timestamps: true });

const assetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assetType: String, name: String, value: Number,
  interestRate: { type: Number, default: 0 },
  compoundingFrequency: { type: String, default: "yearly" },
  purchaseDate: { type: Date, default: Date.now },
  quantity: { type: Number, default: 1 },
  isMarketLinked: { type: Boolean, default: false },
  symbol: { type: String, default: "" },
}, { timestamps: true });

const liabilitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String, amount: Number,
  interestRate: { type: Number, default: null },
  dueDate: Date,
}, { timestamps: true });

const User     = mongoose.model("User", userSchema);
const Family   = mongoose.model("Family", familySchema);
const Expense  = mongoose.model("Expense", expenseSchema);
const Asset    = mongoose.model("Asset", assetSchema);
const Liability = mongoose.model("Liability", liabilitySchema);

// ── Helpers ─────────────────────────────────────────────────────────────────

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Connecting to MongoDB Atlas…");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected");

  // -- Clean up existing demo data --
  const existingUser = await User.findOne({ email: "demo@selvam.in" });
  if (existingUser) {
    console.log("🧹 Removing existing demo data…");
    // Clean up all family members
    const familyMembers = await User.find({ familyId: existingUser.familyId });
    for (const m of familyMembers) {
      await Expense.deleteMany({ user: m._id });
      await Asset.deleteMany({ userId: m._id });
      await Liability.deleteMany({ user: m._id });
    }
    await User.deleteMany({ email: { $in: ["demo@selvam.in", "priya@selvam.in", "aditya@selvam.in"] } });
    await Family.deleteMany({ headUserId: existingUser._id });
  } else {
    // Clean any stale member accounts too
    await User.deleteMany({ email: { $in: ["priya@selvam.in", "aditya@selvam.in"] } });
  }

  // -- Create demo user --
  console.log("👤 Creating demo user (Head)…");
  const hashedPassword = await bcrypt.hash("Demo@1234", 10);
  const user = await User.create({
    name: "Arjun Sharma",
    email: "demo@selvam.in",
    password: hashedPassword,
    role: "Head",
  });

  // -- Create family --
  const joinCode = crypto.randomBytes(4).toString("hex").toUpperCase();
  const family = await Family.create({
    name: "Sharma Family",
    joinCode,
    headUserId: user._id,
  });
  user.familyId = family._id;
  await user.save();

  console.log(`🏠 Family: Sharma Family (Join Code: ${joinCode})`);

  // -- Create family members --
  console.log("👥 Creating family members…");

  const priya = await User.create({
    name: "Priya Sharma",
    email: "priya@selvam.in",
    password: hashedPassword,
    role: "Member",
    familyId: family._id,
  });

  const aditya = await User.create({
    name: "Aditya Sharma",
    email: "aditya@selvam.in",
    password: hashedPassword,
    role: "Member",
    familyId: family._id,
  });

  console.log("   ✅ Priya Sharma (priya@selvam.in)");
  console.log("   ✅ Aditya Sharma (aditya@selvam.in)");


  // -- Expenses (30 realistic entries, last 90 days) --
  console.log("💸 Inserting expenses…");
  const expenses = [
    { amount: 1800, category: "Food",          description: "Swiggy — Weekly groceries",      date: daysAgo(1)  },
    { amount: 450,  category: "Food",          description: "Chai & snacks at Cafe Coffee Day",date: daysAgo(3)  },
    { amount: 2400, category: "Food",          description: "Family dinner at Barbeque Nation",date: daysAgo(6)  },
    { amount: 320,  category: "Transport",     description: "Ola cab — office commute",        date: daysAgo(2)  },
    { amount: 1200, category: "Transport",     description: "Petrol — Hyundai Creta",          date: daysAgo(8)  },
    { amount: 580,  category: "Transport",     description: "Metro card recharge",             date: daysAgo(15) },
    { amount: 25000, category: "Rent",         description: "Monthly apartment rent — Koramangala", date: daysAgo(5)  },
    { amount: 1800, category: "Utilities",     description: "BESCOM electricity bill",         date: daysAgo(10) },
    { amount: 799,  category: "Utilities",     description: "Airtel broadband plan",           date: daysAgo(12) },
    { amount: 350,  category: "Utilities",     description: "Water & maintenance charges",     date: daysAgo(20) },
    { amount: 3500, category: "Shopping",      description: "Myntra — Festive sale clothes",   date: daysAgo(7)  },
    { amount: 1200, category: "Shopping",      description: "Amazon — Kitchen accessories",    date: daysAgo(18) },
    { amount: 8500, category: "Shopping",      description: "Croma — Noise headphones",       date: daysAgo(25) },
    { amount: 2200, category: "Health",        description: "Apollo pharmacy — monthly meds",  date: daysAgo(4)  },
    { amount: 1500, category: "Health",        description: "Gym membership — Cult.fit",       date: daysAgo(9)  },
    { amount: 800,  category: "Health",        description: "Dental check-up consultation",    date: daysAgo(30) },
    { amount: 399,  category: "Entertainment", description: "Netflix subscription",            date: daysAgo(5)  },
    { amount: 599,  category: "Entertainment", description: "BookMyShow — IMAX tickets (2)",   date: daysAgo(13) },
    { amount: 1800, category: "Entertainment", description: "Weekend trip to Nandi Hills",     date: daysAgo(21) },
    { amount: 500,  category: "Other",         description: "Laundry service",                  date: daysAgo(11) },
    // Prior month
    { amount: 1600, category: "Food",          description: "Big Basket monthly order",        date: daysAgo(35) },
    { amount: 25000, category: "Rent",         description: "Monthly apartment rent",           date: daysAgo(35) },
    { amount: 2100, category: "Transport",     description: "Bike servicing — TVS Ntorq",      date: daysAgo(40) },
    { amount: 4200, category: "Shopping",      description: "Dmart household supplies",         date: daysAgo(42) },
    { amount: 1200, category: "Health",        description: "Annual health check-up",           date: daysAgo(45) },
    { amount: 299,  category: "Entertainment", description: "Disney+ Hotstar premium",          date: daysAgo(37) },
    { amount: 1800, category: "Utilities",     description: "BWSSB water bill + maintenance",  date: daysAgo(50) },
    { amount: 650,  category: "Food",          description: "Zomato orders (7 orders)",         date: daysAgo(55) },
    { amount: 950,  category: "Other",         description: "Barber + grooming",               date: daysAgo(60) },
    { amount: 25000, category: "Rent",         description: "Monthly apartment rent",           date: daysAgo(65) },
  ];

  await Expense.insertMany(expenses.map(e => ({ ...e, user: user._id })));
  console.log(`   ✅ ${expenses.length} expenses inserted`);

  // -- Assets --
  console.log("🏦 Inserting assets…");
  const assets = [
    {
      assetType: "Gold",      name: "Gold Jewellery (22k)",
      value: 180000, quantity: 30, isMarketLinked: true,
      purchaseDate: daysAgo(730),
    },
    {
      assetType: "FD",        name: "SBI Fixed Deposit",
      value: 300000, interestRate: 7.1,
      compoundingFrequency: "quarterly", purchaseDate: daysAgo(365),
    },
    {
      assetType: "Stock",     name: "Reliance Industries (NSE)",
      value: 125000, purchaseDate: daysAgo(540),
    },
    {
      assetType: "Cash",      name: "Savings Account — SBI",
      value: 85000, purchaseDate: daysAgo(30),
    },
    {
      assetType: "MutualFund", name: "Mirae Asset Large Cap Fund",
      value: 200000, interestRate: 12.5,
      compoundingFrequency: "yearly", purchaseDate: daysAgo(900),
    },
    {
      assetType: "RealEstate", name: "Plot in Mysore (inherited)",
      value: 1500000, purchaseDate: daysAgo(3650),
    },
    {
      assetType: "Crypto",    name: "Bitcoin (0.02 BTC)",
      value: 135000, purchaseDate: daysAgo(180),
    },
  ];

  await Asset.insertMany(assets.map(a => ({ ...a, userId: user._id })));
  console.log(`   ✅ ${assets.length} assets inserted`);

  // -- Liabilities --
  console.log("📉 Inserting liabilities…");
  const liabilities = [
    {
      type: "Home Loan",    amount: 3500000, interestRate: 8.5,
      dueDate: new Date("2040-01-01"),
    },
    {
      type: "Car EMI",      amount: 425000,  interestRate: 9.2,
      dueDate: new Date("2027-06-01"),
    },
    {
      type: "Credit Card",  amount: 18500,   interestRate: 36,
      dueDate: new Date("2026-04-05"),
    },
    {
      type: "Personal Loan", amount: 75000,  interestRate: 14,
      dueDate: new Date("2026-12-01"),
    },
  ];

  await Liability.insertMany(liabilities.map(l => ({ ...l, user: user._id })));
  console.log(`   ✅ ${liabilities.length} liabilities inserted`);

  // -- Priya Sharma's expenses (spouse — grocery, health, shopping focused) --
  console.log("💸 Inserting Priya's expenses…");
  const priyaExpenses = [
    { amount: 3800, category: "Food",          description: "Big Basket monthly groceries",      date: daysAgo(2)  },
    { amount: 950,  category: "Food",          description: "Swiggy — dinner orders (week)",      date: daysAgo(7)  },
    { amount: 5500, category: "Shopping",      description: "Nykaa — skincare & cosmetics",       date: daysAgo(4)  },
    { amount: 2800, category: "Shopping",      description: "Westside — festive sarees",          date: daysAgo(14) },
    { amount: 1800, category: "Health",        description: "Max Healthcare — annual check-up",   date: daysAgo(10) },
    { amount: 1200, category: "Health",        description: "Yoga class monthly membership",      date: daysAgo(5)  },
    { amount: 650,  category: "Transport",     description: "Rapido & auto — local commute",      date: daysAgo(3)  },
    { amount: 499,  category: "Entertainment", description: "Spotify family plan",               date: daysAgo(6)  },
    { amount: 320,  category: "Utilities",     description: "DTH recharge — Sun Direct",         date: daysAgo(8)  },
    { amount: 750,  category: "Other",         description: "Prayer room essentials + flowers",  date: daysAgo(12) },
    // Prior month
    { amount: 3600, category: "Food",          description: "Monthly grocery run — Dmart",        date: daysAgo(37) },
    { amount: 4200, category: "Shopping",      description: "Amazon — home decor items",          date: daysAgo(42) },
    { amount: 900,  category: "Health",        description: "Pharmacy — vitamins & supplements",  date: daysAgo(45) },
  ];
  await Expense.insertMany(priyaExpenses.map(e => ({ ...e, user: priya._id })));
  console.log(`   ✅ ${priyaExpenses.length} expenses for Priya inserted`);

  // -- Aditya Sharma's expenses (son — college student, entertainment + food heavy) --
  console.log("💸 Inserting Aditya's expenses…");
  const adityaExpenses = [
    { amount: 1200, category: "Food",          description: "College canteen + Zomato orders",   date: daysAgo(1)  },
    { amount: 899,  category: "Entertainment", description: "PUBG Mobile — UC top-up",           date: daysAgo(3)  },
    { amount: 2200, category: "Shopping",      description: "Flipkart — gaming mouse",           date: daysAgo(9)  },
    { amount: 580,  category: "Transport",     description: "Rapido bike taxi — college",         date: daysAgo(2)  },
    { amount: 349,  category: "Entertainment", description: "Amazon Prime subscription",         date: daysAgo(5)  },
    { amount: 1500, category: "Health",        description: "Gym membership — near college",      date: daysAgo(8)  },
    { amount: 750,  category: "Food",          description: "Boba tea + pizza with friends",      date: daysAgo(6)  },
    { amount: 420,  category: "Other",         description: "Stationery & college supplies",     date: daysAgo(11) },
    // Prior month
    { amount: 1100, category: "Food",          description: "Monthly mess fees",                  date: daysAgo(36) },
    { amount: 3500, category: "Shopping",      description: "JBL earphones — Amazon",            date: daysAgo(40) },
    { amount: 299,  category: "Entertainment", description: "Chess.com premium plan",            date: daysAgo(38) },
  ];
  await Expense.insertMany(adityaExpenses.map(e => ({ ...e, user: aditya._id })));
  console.log(`   ✅ ${adityaExpenses.length} expenses for Aditya inserted`);

  // -- Priya's assets (jewellery + savings) --
  const priyaAssets = [
    { assetType: "Gold", name: "Gold bangles (18k)", value: 95000, quantity: 15, isMarketLinked: true, purchaseDate: daysAgo(1825) },
    { assetType: "Cash", name: "HDFC Savings Account", value: 42000, purchaseDate: daysAgo(90) },
    { assetType: "FD",   name: "Post Office NSC — 5yr", value: 150000, interestRate: 7.7, compoundingFrequency: "yearly", purchaseDate: daysAgo(730) },
  ];
  await Asset.insertMany(priyaAssets.map(a => ({ ...a, userId: priya._id })));
  console.log(`   ✅ ${priyaAssets.length} assets for Priya inserted`);

  console.log("\n🎉 Seeding complete!");
  console.log("─".repeat(55));
  console.log("  👤 Arjun Sharma (Head)");
  console.log("     📧 demo@selvam.in   🔑 Demo@1234");
  console.log("  👤 Priya Sharma (Spouse / Member)");
  console.log("     📧 priya@selvam.in  🔑 Demo@1234");
  console.log("  👤 Aditya Sharma (Son / Member)");
  console.log("     📧 aditya@selvam.in 🔑 Demo@1234");
  console.log(`  🏠 Family Join Code : ${joinCode}`);
  console.log("─".repeat(55));

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
