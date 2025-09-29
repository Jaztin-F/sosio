import { useEffect, useContext, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { NotificationContext } from "../../contexts/NotificationContext";

function Loan() {
  const { showError } = useContext(NotificationContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.title = "Loan - Sosio";
    
    // Get user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Temporarily disable API call
  const loansData = {
    currentLoans: [
      { id: 1, type: "Personal Loan", amount: 2500.00, remaining: 1800.00, monthlyPayment: 200.00, dueDate: "2024-02-15" },
      { id: 2, type: "Business Loan", amount: 5000.00, remaining: 3200.00, monthlyPayment: 400.00, dueDate: "2024-02-20" }
    ],
    totalBorrowed: 7500.00,
    totalRemaining: 5000.00
  };
  const loading = false;
  const error = null;

  useEffect(() => {
    if (error) {
      showError("Failed to load loan data");
    }
  }, [error, showError]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-white text-xl">Loading loan data...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-white text-4xl mb-6">Loan Management</h1>
      <div className="space-y-6">
        {/* Loan Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-white text-xl font-semibold mb-2">Total Borrowed</h3>
            <p className="text-3xl font-bold text-blue-400">
              ${loansData?.totalBorrowed?.toLocaleString() || '0.00'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-white text-xl font-semibold mb-2">Remaining Balance</h3>
            <p className="text-3xl font-bold text-orange-400">
              ${loansData?.totalRemaining?.toLocaleString() || '0.00'}
            </p>
          </div>
        </div>

        {/* Current Loans */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-white text-xl font-semibold mb-4">Current Loans</h3>
          {loansData?.currentLoans?.length > 0 ? (
            <div className="space-y-3">
              {loansData.currentLoans.map((loan) => (
                <div key={loan.id} className="p-4 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-white font-semibold text-lg">{loan.type}</span>
                      <p className="text-sm text-gray-300">Due: {loan.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-green-400 text-xl font-bold">
                        ${loan.remaining.toLocaleString()}
                      </span>
                      <p className="text-sm text-gray-400">remaining</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm text-gray-400">Original Amount</p>
                      <p className="text-white font-medium">${loan.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Monthly Payment</p>
                      <p className="text-white font-medium">${loan.monthlyPayment.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">No active loans</p>
            </div>
          )}
        </div>
        
        {/* Request New Loan */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-white text-xl font-semibold mb-4">Request New Loan</h3>
          <p className="text-gray-300 mb-4">Apply for a new loan to fund your projects or personal needs.</p>
          <button className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg transition font-semibold">
            Apply for Loan
          </button>
        </div>
      </div>
    </div>
  );
}

export default Loan;
