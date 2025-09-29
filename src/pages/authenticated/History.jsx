import { useEffect, useContext, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { NotificationContext } from "../../contexts/NotificationContext";

function History() {
  const { showError } = useContext(NotificationContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.title = "Transaction History - Sosio";
    
    // Get user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Temporarily disable API call
  const historyData = [
    { id: 1, type: "Loan Payment", amount: -500.00, date: "2024-01-15", status: "completed", description: "Monthly loan payment" },
    { id: 2, type: "Investment Return", amount: 150.00, date: "2024-01-14", status: "completed", description: "Stock dividend" },
    { id: 3, type: "Salary Deposit", amount: 3000.00, date: "2024-01-10", status: "completed", description: "Monthly salary" },
    { id: 4, type: "Investment Purchase", amount: -1000.00, date: "2024-01-05", status: "completed", description: "Bought stocks" },
    { id: 5, type: "Loan Disbursement", amount: 2500.00, date: "2024-01-01", status: "completed", description: "Personal loan approved" }
  ];
  const loading = false;
  const error = null;

  useEffect(() => {
    if (error) {
      showError("Failed to load transaction history");
    }
  }, [error, showError]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-white text-xl">Loading transaction history...</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'Loan Payment':
        return '💳';
      case 'Investment Return':
        return '📈';
      case 'Salary Deposit':
        return '💰';
      case 'Investment Purchase':
        return '📊';
      case 'Loan Disbursement':
        return '🏦';
      default:
        return '💼';
    }
  };

  return (
    <div>
      <h1 className="text-white text-4xl mb-6">Transaction History</h1>
      
      {/* Transaction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-white text-lg font-semibold mb-2">Total Transactions</h3>
          <p className="text-2xl font-bold text-blue-400">
            {historyData?.length || 0}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-white text-lg font-semibold mb-2">This Month</h3>
          <p className="text-2xl font-bold text-green-400">
            {historyData?.filter(t => new Date(t.date).getMonth() === new Date().getMonth()).length || 0}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-white text-lg font-semibold mb-2">Last Transaction</h3>
          <p className="text-lg font-bold text-purple-400">
            {historyData?.length > 0 ? formatDate(historyData[0].date) : 'None'}
          </p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h3 className="text-white text-xl font-semibold mb-4">All Transactions</h3>
        {historyData?.length > 0 ? (
          <div className="space-y-3">
            {historyData.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <span className="text-white font-medium text-lg">{transaction.type}</span>
                    <p className="text-sm text-gray-300">{transaction.description}</p>
                    <p className="text-xs text-gray-400">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xl font-bold ${
                    transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}${transaction.amount.toLocaleString()}
                  </span>
                  <p className={`text-xs font-medium ${
                    transaction.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-400 text-lg">No transactions yet</p>
            <p className="text-gray-500 text-sm mt-2">Your transaction history will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
