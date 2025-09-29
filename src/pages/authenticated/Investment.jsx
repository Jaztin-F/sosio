import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";

export default function Investments(){
  const [user, setUser] = useState(null);
  useEffect(()=> {
    const s = localStorage.getItem("user");
    if (s) setUser(JSON.parse(s));
  }, []);

  const userId = user?.id;
  const { data, loading, error, refetch } = useApi(userId ? `http://localhost:5000/api/investments/${userId}` : null);

  if (!user) return <div>Please sign in...</div>;
  if (loading) return <div>Loading investments...</div>;
  if (error) return <div>Error loading investments</div>;

  const portfolio = data?.portfolio || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-3xl">Investments</h1>
        <button onClick={() => refetch && refetch()} className="btn">Refresh</button>
      </div>

      <div>
        {portfolio.length === 0 && <div className="text-gray-400">No investments</div>}
        {portfolio.map(p => (
          <div key={p.id} className="p-4 bg-white/5 rounded mb-3 flex justify-between">
            <div>
              <div className="font-semibold text-white">{p.name}</div>
              <div className="text-sm text-gray-300">{p.type}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">${Number(p.amount).toLocaleString()}</div>
              <div className="text-sm text-gray-400">Return: {p.returnRate}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
