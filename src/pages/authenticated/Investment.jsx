import { useEffect, useContext, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { NotificationContext } from "../../contexts/NotificationContext";

function Investment() {
  const { showError } = useContext(NotificationContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.title = "Investment - Sosio";
    
    // Get user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Temporarily disable API call
  const investmentsData = {
    portfolio: [
      { id: 1, name: "Stocks Portfolio", amount: 3200.00, return: 12.5, type: "stocks" },
      { id: 2, name: "Bonds", amount: 2000.00, return: 4.2, type: "bonds" }
    ],
    totalValue: 5200.00,
    totalReturn: 8.7
  };
  const loading = false;
  const error = null;

  useEffect(() => {
    if (error) {
      showError("Failed to load investment data");
    }
  }, [error, showError]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-white text-xl">Loading investment data...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-white text-4xl mb-6">Investment Portfolio</h1>
      <div className="space-y-6">
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-white text-xl font-semibold mb-2">Total Value</h3>
            <p className="text-3xl font-bold text-green-400">
              ${investmentsData?.totalValue?.toLocaleString() || '0.00'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-white text-xl font-semibold mb-2">Total Return</h3>
            <p className="text-3xl font-bold text-blue-400">
              +{investmentsData?.totalReturn || 0}%
            </p>
          </div>
        </div>

        {/* Investment Portfolio */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-white text-xl font-semibold mb-4">Current Investments</h3>
          {investmentsData?.portfolio?.length > 0 ? (
            <div className="space-y-4">
              {investmentsData.portfolio.map((investment) => (
                <div key={investment.id} className="p-4 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-white font-semibold text-lg">{investment.name}</span>
                      <p className="text-sm text-gray-300 capitalize">{investment.type}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-green-400 text-xl font-bold">
                        ${investment.amount.toLocaleString()}
                      </span>
                      <p className="text-sm text-gray-400">current value</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Return Rate</p>
                      <p className={`text-lg font-semibold ${
                        investment.return > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {investment.return > 0 ? '+' : ''}{investment.return}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Type</p>
                      <p className="text-white font-medium capitalize">{investment.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">No investments yet</p>
              <p className="text-gray-500 text-sm mt-2">Start building your portfolio today</p>
            </div>
          )}
        </div>

        {/* Investment Actions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-white text-xl font-semibold mb-4">Investment Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition font-semibold">
              Buy Stocks
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition font-semibold">
              Invest in Bonds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Investment;
