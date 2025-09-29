import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors({ origin: "http://localhost:5173" })); // React frontend port
app.use(express.json());

// --- DB connection ---
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // your MySQL password
  database: "sosio"
});

// Test DB connection
db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
  } else {
    console.log("Connected to MySQL database!");
  }
});

// --- Login route ---
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Please enter a valid email address" });
  }

  // Password length validation
  if (password.length < 3) {
    return res.status(400).json({ success: false, message: "Password must be at least 3 characters long" });
  }

  // First, check if email exists
  const checkEmailSql = "SELECT * FROM members WHERE email = ?";
  db.query(checkEmailSql, [email], (err, emailResults) => {
    if (err) {
      console.error("DB query error:", err);
      return res.status(500).json({ success: false, message: "Database connection error. Please try again." });
    }

    if (emailResults.length === 0) {
      return res.status(401).json({ success: false, message: "No account found with this email address" });
    }

    // Email exists, now check password
    const user = emailResults[0];
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Incorrect password. Please try again." });
    }

    // Both email and password are correct
    // If codename doesn't exist, generate one from email
    if (!user.codename) {
      const emailPrefix = user.email.split('@')[0];
      // Generate a 2-3 character codename
      if (emailPrefix.length >= 3) {
        user.codename = emailPrefix.substring(0, 3).toUpperCase();
      } else {
        user.codename = emailPrefix.toUpperCase() + Math.floor(Math.random() * 10);
      }
    }

    // If fullname doesn't exist, use email prefix as fallback
    if (!user.fullname) {
      user.fullname = user.email.split('@')[0];
    }
    
    return res.json({ 
      success: true, 
      message: `Welcome back, ${user.fullname}!`, 
      user 
    });
  });
});

// --- User Data Routes ---
app.get("/api/user/:userId", (req, res) => {
  const { userId } = req.params;
  
  const sql = "SELECT * FROM members WHERE id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("DB query error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const user = results[0];
    return res.json({ success: true, user });
  });
});

// Get user dashboard data
app.get("/api/dashboard/:userId", (req, res) => {
  const { userId } = req.params;
  
  // For now, return mock data structure - you can replace with real queries
  const dashboardData = {
    totalBalance: 12450.00,
    activeLoans: 3,
    investments: 5200.00,
    recentTransactions: [
      { id: 1, type: "Loan Payment", amount: -500.00, date: "2024-01-15", description: "Monthly loan payment" },
      { id: 2, type: "Investment Return", amount: 150.00, date: "2024-01-14", description: "Stock dividend" },
      { id: 3, type: "Salary Deposit", amount: 3000.00, date: "2024-01-10", description: "Monthly salary" }
    ]
  };
  
  res.json({ success: true, data: dashboardData });
});

// Get user loans
app.get("/api/loans/:userId", (req, res) => {
  const { userId } = req.params;
  
  // Mock loan data - replace with real database queries
  const loansData = {
    currentLoans: [
      { id: 1, type: "Personal Loan", amount: 2500.00, remaining: 1800.00, monthlyPayment: 200.00, dueDate: "2024-02-15" },
      { id: 2, type: "Business Loan", amount: 5000.00, remaining: 3200.00, monthlyPayment: 400.00, dueDate: "2024-02-20" }
    ],
    totalBorrowed: 7500.00,
    totalRemaining: 5000.00
  };
  
  res.json({ success: true, data: loansData });
});

// Get user investments
app.get("/api/investments/:userId", (req, res) => {
  const { userId } = req.params;
  
  // Mock investment data - replace with real database queries
  const investmentsData = {
    portfolio: [
      { id: 1, name: "Stocks Portfolio", amount: 3200.00, return: 12.5, type: "stocks" },
      { id: 2, name: "Bonds", amount: 2000.00, return: 4.2, type: "bonds" }
    ],
    totalValue: 5200.00,
    totalReturn: 8.7
  };
  
  res.json({ success: true, data: investmentsData });
});

// Get transaction history
app.get("/api/history/:userId", (req, res) => {
  const { userId } = req.params;
  
  // Mock transaction data - replace with real database queries
  const historyData = [
    { id: 1, type: "Loan Payment", amount: -500.00, date: "2024-01-15", status: "completed", description: "Monthly loan payment" },
    { id: 2, type: "Investment Return", amount: 150.00, date: "2024-01-14", status: "completed", description: "Stock dividend" },
    { id: 3, type: "Salary Deposit", amount: 3000.00, date: "2024-01-10", status: "completed", description: "Monthly salary" },
    { id: 4, type: "Investment Purchase", amount: -1000.00, date: "2024-01-05", status: "completed", description: "Bought stocks" },
    { id: 5, type: "Loan Disbursement", amount: 2500.00, date: "2024-01-01", status: "completed", description: "Personal loan approved" }
  ];
  
  res.json({ success: true, data: historyData });
});

// --- Start server ---
const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
