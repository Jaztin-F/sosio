import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";

export default function Loans() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const userId = user?.id;
  const { data, loading, error, refetch } = useApi(userId ? `http://localhost:5000/api/loans/${userId}` : null);

  if (!user) return <div>Please sign in...</div>;
  if (loading) return <div>Loading loans...</div>;
  if (error) return <div>Error loading loans</div>;

  const loans = data?.currentLoans || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-3xl">Loans</h1>
        <button onClick={() => refetch && refetch()} className="btn">Refresh</button>
      </div>

      <div>
        {loans.length === 0 && <div className="text-gray-400">No active loans</div>}
        {loans.map(l => (
          <div key={l.id} className="p-4 bg-white/5 rounded mb-3 flex justify-between">
            <div>
              <div className="font-semibold text-white">{l.type}</div>
              <div className="text-sm text-gray-300">Due: {l.dueDate}</div>
              <div className="text-sm text-gray-400">Monthly: ${Number(l.monthlyPayment).toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">${Number(l.remaining).toLocaleString()}</div>
              <div className="text-sm text-gray-400">Status: {l.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
