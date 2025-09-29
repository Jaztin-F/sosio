import { useEffect, useContext, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { NotificationContext } from "../../contexts/NotificationContext";

function Dashboard() {
  const { showError } = useContext(NotificationContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.title = "Dashboard - Sosio";
    
    // Get user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Temporarily disable API call
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
  const loading = false;
  const error = null;

  useEffect(() => {
    if (error) {
      showError("Failed to load dashboard data");
    }
  }, [error, showError]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-white text-4xl mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-white text-xl font-semibold mb-2">Total Balance</h3>
          <p className="text-3xl font-bold text-green-400">
            ${dashboardData?.totalBalance?.toLocaleString() || '0.00'}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-white text-xl font-semibold mb-2">Active Loans</h3>
          <p className="text-3xl font-bold text-blue-400">
            {dashboardData?.activeLoans || 0}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-white text-xl font-semibold mb-2">Investments</h3>
          <p className="text-3xl font-bold text-purple-400">
            ${dashboardData?.investments?.toLocaleString() || '0.00'}
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      {dashboardData?.recentTransactions && (
        <div className="mt-8">
          <h2 className="text-white text-2xl font-semibold mb-4">Recent Transactions</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="space-y-3">
              {dashboardData.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-3 bg-white/5 rounded">
                  <div>
                    <span className="text-white font-medium">{transaction.type}</span>
                    <p className="text-sm text-gray-300">{transaction.description}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-semibold ${
                      transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${transaction.amount.toLocaleString()}
                    </span>
                    <p className="text-sm text-gray-400">{transaction.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
