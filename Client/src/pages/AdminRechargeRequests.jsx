import { useEffect, useState } from 'react';

export default function AdminRechargeRequests() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setMessage('');
    try {
      const userRaw = localStorage.getItem('user');
      const user = JSON.parse(userRaw);
      const token = user?.token;
      if (!token) return;
      const res = await fetch('https://invest-2-9yoa.onrender.com/api/recharge/all-pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setRequests(data);
      } else {
        setMessage(data.message || 'Failed to fetch requests');
      }
    } catch {
      setMessage('Failed to fetch requests');
    }
  };

  const handleApprove = async (rechargeId) => {
    setMessage('');
    try {
      const userRaw = localStorage.getItem('user');
      const user = JSON.parse(userRaw);
      const token = user?.token;
      if (!token) return;
      const res = await fetch('https://invest-2-9yoa.onrender.com/api/recharge/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rechargeId })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Recharge approved!');
        fetchRequests();
      } else {
        setMessage(data.message || 'Approval failed');
      }
    } catch {
      setMessage('Approval failed');
    }
  };

  const handleReject = async (rechargeId) => {
    setMessage('');
    try {
      const userRaw = localStorage.getItem('user');
      const user = JSON.parse(userRaw);
      const token = user?.token;
      if (!token) return;
      const res = await fetch('https://invest-2-9yoa.onrender.com/api/recharge/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rechargeId })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Recharge rejected!');
        fetchRequests();
      } else {
        setMessage(data.message || 'Rejection failed');
      }
    } catch {
      setMessage('Rejection failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Recharge Requests</h2>
      {message && <div className="mb-4 text-center text-sm text-red-500">{message}</div>}
      <table className="w-full border text-xs">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-2 border">User</th>
            <th className="py-2 px-2 border">Amount</th>
            <th className="py-2 px-2 border">UTR</th>
            <th className="py-2 px-2 border">Requested</th>
            <th className="py-2 px-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r._id}>
              <td className="py-1 px-2 border">{r.user?.email || r.user?.name || r.user || '-'}</td>
              <td className="py-1 px-2 border">₹{r.amount}</td>
              <td className="py-1 px-2 border">{r.utr || '-'}</td>
              <td className="py-1 px-2 border">{new Date(r.createdAt).toLocaleString()}</td>
              <td className="py-1 px-2 border flex gap-2">
                <button onClick={() => handleApprove(r._id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs">Approve</button>
                <button onClick={() => handleReject(r._id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Reject</button>
              </td>
            </tr>
          ))}
          {requests.length === 0 && (
            <tr><td colSpan="5" className="text-center py-4">No pending requests</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
