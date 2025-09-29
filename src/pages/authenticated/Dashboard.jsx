import { useEffect, useContext, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { NotificationContext } from "../../contexts/NotificationContext";

function Dashboard() {
  const { showError } = useContext(NotificationContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.title = "Dashboard - Sosio";
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const userId = user?.id;
  const { data: dashboardData, loading, error, refetch } = useApi(
    userId ? `http://localhost:5000/api/dashboard/${userId}` : null
  );

  useEffect(() => {
    if (error) showError?.("Failed to load dashboard data");
  }, [error, showError]);

  if (!user) return <div className="flex items-center justify-center min-h-64"><div className="text-white text-xl">Please sign in...</div></div>;
  if (loading) return <div className="flex items-center justify-center min-h-64"><div className="text-white text-xl">Loading dashboard...</div></div>;

  const d = dashboardData ?? { totalBalance:0, activeLoans:0, investments:0, recentTransactions:[] };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-4xl">Dashboard</h1>
        <button className="btn" onClick={() => refetch && refetch()}>Refresh</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-white text-xl font-semibold mb-2">Total Balance</h3>
          <p className="text-3xl font-bold text-green-400">${Number(d.totalBalance || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-white text-xl font-semibold mb-2">Active Loans</h3>
          <p className="text-3xl font-bold text-blue-400">{d.activeLoans || 0}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-white text-xl font-semibold mb-2">Investments</h3>
          <p className="text-3xl font-bold text-purple-400">${Number(d.investments || 0).toLocaleString()}</p>
        </div>
      </div>

      {d.recentTransactions && (
        <div className="mt-8">
          <h2 className="text-white text-2xl font-semibold mb-4">Recent Transactions</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="space-y-3">
              {d.recentTransactions.map(tx => (
                <div key={tx.id} className="flex justify-between items-center p-3 bg-white/5 rounded">
                  <div>
                    <span className="text-white font-medium">{tx.type}</span>
                    <p className="text-sm text-gray-300">{tx.description}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-semibold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.amount > 0 ? '+' : ''}${Number(tx.amount).toLocaleString()}
                    </span>
                    <p className="text-sm text-gray-400">{tx.date}</p>
                  </div>
                </div>
              ))}
              {d.recentTransactions.length === 0 && <div className="text-gray-400">No recent transactions</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
