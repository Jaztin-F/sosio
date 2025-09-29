// backend/server.js
import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// --- MySQL connection: adjust credentials in .env or here ---
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "sosio"
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL connection error:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

/*
  Helper: run query wrapped in a Promise for easier async/await usage
*/
function q(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

/* -----------------------
   Authentication & user
   ----------------------- */
// Login (existing logic preserved, but using q())
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success:false, message:"Email and password required" });

    const rows = await q("SELECT * FROM members WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(401).json({ success:false, message:"No account found with this email address" });

    const user = rows[0];

    // NOTE: you should hash passwords in production. For now the repo uses plaintext.
    if (user.password !== password) return res.status(401).json({ success:false, message:"Incorrect password. Please try again." });

    // Autogenerate codename/fullname fallbacks
    if (!user.codename) {
      const prefix = (user.email || "").split("@")[0] || "USR";
      user.codename = (prefix.length >=3 ? prefix.slice(0,3) : prefix + Math.floor(Math.random()*10)).toUpperCase();
    }
    if (!user.fullname) user.fullname = (user.email || "").split("@")[0];

    // Remove sensitive fields before sending client
    const safeUser = { id: user.id, email: user.email, fullname: user.fullname, codename: user.codename, role: user.role };
    return res.json({ success: true, message: `Welcome back, ${safeUser.fullname}!`, user: safeUser });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success:false, message:"Server error" });
  }
});

// Get user profile
app.get("/api/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const rows = await q("SELECT id, email, fullname, codename, role, balance FROM members WHERE id = ?", [userId]);
    if (rows.length === 0) return res.status(404).json({ success:false, message:"User not found" });
    return res.json({ success:true, user: rows[0] });
  } catch (err) {
    console.error("User fetch error:", err);
    return res.status(500).json({ success:false, message:"DB error" });
  }
});

/* -----------------------
   Dashboard - real queries
   ----------------------- */
app.get("/api/dashboard/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // recent transactions (limit 10)
    const transactions = await q(
      "SELECT id, type, amount, date, description FROM transactions WHERE userId = ? ORDER BY date DESC LIMIT 10",
      [userId]
    );

    // totalBalance: prefer cached value on members.balance, otherwise compute from transactions
    const balRows = await q("SELECT COALESCE(balance,0) as balance FROM members WHERE id = ?", [userId]);
    const totalBalance = (balRows[0] && Number(balRows[0].balance)) || 0;

    // active loans
    const loanRows = await q("SELECT COUNT(*) as activeLoans FROM loans WHERE userId = ? AND status = 'active'", [userId]);
    const activeLoans = loanRows[0]?.activeLoans ? Number(loanRows[0].activeLoans) : 0;

    // investments total
    const invRows = await q("SELECT COALESCE(SUM(amount),0) as investments FROM investments WHERE userId = ?", [userId]);
    const investments = invRows[0]?.investments ? Number(invRows[0].investments) : 0;

    return res.json({
      success: true,
      data: {
        totalBalance,
        activeLoans,
        investments,
        recentTransactions: transactions
      }
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ success:false, message:"DB error" });
  }
});

/* -----------------------
   Loans
   ----------------------- */
app.get("/api/loans/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const loans = await q("SELECT id, type, principal, remaining, monthlyPayment, dueDate, status FROM loans WHERE userId = ?", [userId]);

    const totalBorrowed = loans.reduce((s, r) => s + (Number(r.principal) || 0), 0);
    const totalRemaining = loans.reduce((s, r) => s + (Number(r.remaining) || 0), 0);

    return res.json({ success:true, data: { currentLoans: loans, totalBorrowed, totalRemaining }});
  } catch (err) {
    console.error("Loans error:", err);
    return res.status(500).json({ success:false, message:"DB error" });
  }
});

/* -----------------------
   Investments
   ----------------------- */
app.get("/api/investments/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const rows = await q("SELECT id, name, amount, returnRate, type FROM investments WHERE userId = ?", [userId]);
    const totalValue = rows.reduce((s, r) => s + (Number(r.amount) || 0), 0);
    return res.json({ success:true, data: { portfolio: rows, totalValue }});
  } catch (err) {
    console.error("Investments error:", err);
    return res.status(500).json({ success:false, message:"DB error" });
  }
});

/* -----------------------
   History (transactions)
   ----------------------- */
app.get("/api/history/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const rows = await q("SELECT id, type, amount, date, status, description FROM transactions WHERE userId = ? ORDER BY date DESC LIMIT 500", [userId]);
    return res.json({ success:true, data: rows });
  } catch (err) {
    console.error("History error:", err);
    return res.status(500).json({ success:false, message:"DB error" });
  }
});

/* -----------------------
   Simple health
   ----------------------- */
app.get("/health", (req, res) => res.json({ ok: true }));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
