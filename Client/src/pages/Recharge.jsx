import { useEffect, useState } from 'react';

export default function Recharge() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [utr, setUtr] = useState('');
  const [rechargeId, setRechargeId] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const userRaw = localStorage.getItem('user');
      const user = JSON.parse(userRaw);
      const token = user?.token;
      if (!token) return;
      const res = await fetch('https://invest-2-9yoa.onrender.com/api/recharge/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setHistory(data);
      // Check for approved recharges and notify
      const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
      (data || []).forEach(r => {
        if (r.status === 'Approved' && !notifications.some(n => n.rechargeId === r._id)) {
          notifications.unshift({
            title: 'Recharge Approved',
            message: `Your recharge of ₹${r.amount} has been approved!`,
            time: new Date(r.approvedAt || r.updatedAt || r.createdAt).toLocaleString(),
            rechargeId: r._id
          });
        }
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch {}
  };

  const handleRequest = async e => {
    e.preventDefault();
    setMessage('');
    setQrUrl('');
    setRechargeId('');
    try {
      const userRaw = localStorage.getItem('user');
      let user = null;
      let token = null;
      try {
        user = JSON.parse(userRaw);
        token = user?.token;
      } catch (err) {
        setMessage('User info in localStorage is invalid. Please log in again.');
        return;
      }
      if (!token) {
        setMessage('You must be logged in to recharge. (No token found)');
        return;
      }
      const res = await fetch('https://invest-2-9yoa.onrender.com/api/recharge/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: Number(amount) })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Scan QR and submit UTR after payment.');
        setQrUrl(data.recharge.qrUrl);
        setRechargeId(data.recharge._id);
        setAmount('');
        fetchHistory();
      } else {
        setMessage(data.message || 'Recharge request failed');
      }
    } catch (err) {
      setMessage('Recharge request failed');
    }
  };

  const handleUtrSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const userRaw = localStorage.getItem('user');
      let user = null;
      let token = null;
      try {
        user = JSON.parse(userRaw);
        token = user?.token;
      } catch (err) {
        setMessage('User info in localStorage is invalid. Please log in again.');
        return;
      }
      if (!token) {
        setMessage('You must be logged in to submit UTR. (No token found)');
        return;
      }
      const res = await fetch('https://invest-2-9yoa.onrender.com/api/recharge/utr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rechargeId, utr })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('UTR submitted! Awaiting admin approval.');
        setUtr('');
        setRechargeId('');
        fetchHistory();
      } else {
        setMessage(data.message || 'UTR submission failed');
      }
    } catch (err) {
      setMessage('UTR submission failed');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[60vh] bg-gray-50 py-8">
      <form onSubmit={handleRequest} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-100 space-y-4 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Recharge Wallet</h2>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold py-2 rounded-lg shadow transition-all duration-200">Generate QR</button>
        {qrUrl && (
          <div className="flex flex-col items-center mt-4">
            <img src={qrUrl} alt="QR Code" className="w-40 h-40 border-2 border-blue-300 rounded-lg" />
            <p className="text-xs text-gray-500 mt-2">Scan and pay, then submit UTR below.</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-blue-700 font-semibold">UPI ID:</span>
              <span className="text-sm text-gray-800 select-all" id="upi-id">7300655336@ptyes</span>
              <button
                type="button"
                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded border border-blue-300"
                onClick={() => {
                  navigator.clipboard.writeText('7300655336@ptyes');
                  setMessage('UPI ID copied!');
                }}
              >Copy</button>
            </div>
          </div>
        )}
        {rechargeId && (
          <div className="mt-4 flex flex-col items-center">
            <input
              type="text"
              value={utr}
              onChange={e => setUtr(e.target.value)}
              placeholder="Enter UTR after payment"
              className="border border-gray-300 rounded-lg p-2 w-full mb-2"
              required
            />
            <button
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleUtrSubmit}
            >Submit UTR</button>
          </div>
        )}
        {message && <div className={`mt-2 text-center text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</div>}
      </form>
      <div className="w-full max-w-2xl mt-8">
        <h3 className="text-lg font-bold mb-2">Recharge History</h3>
        <table className="w-full border text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-2 border">Amount</th>
              <th className="py-2 px-2 border">Status</th>
              <th className="py-2 px-2 border">UTR</th>
              <th className="py-2 px-2 border">Requested</th>
              <th className="py-2 px-2 border">Approved</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map(r => (
                <tr key={r._id}>
                  <td className="py-1 px-2 border">₹{r.amount}</td>
                  <td className="py-1 px-2 border">{r.status}</td>
                  <td className="py-1 px-2 border">{r.utr || '-'}</td>
                  <td className="py-1 px-2 border">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="py-1 px-2 border">{r.approvedAt ? new Date(r.approvedAt).toLocaleString() : '-'}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center py-4">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
