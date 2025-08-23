
import { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaUserCircle } from 'react-icons/fa';

export default function ApproveWithdraw() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch('https://invest-2-9yoa.onrender.com/api/admin/withdraws', {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` },
    })
      .then(res => res.json())
      .then(setRequests);
  }, []);


  const approve = id => {
    fetch(`https://invest-2-9yoa.onrender.com/api/admin/withdraw/${id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` }
    })
      .then(() => setRequests(reqs => reqs.map(r => r._id === id ? { ...r, status: 'Approved' } : r)));
  };

  const reject = id => {
    fetch(`https://invest-2-9yoa.onrender.com/api/admin/withdraw/${id}/reject`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` }
    })
      .then(() => setRequests(reqs => reqs.map(r => r._id === id ? { ...r, status: 'Rejected' } : r)));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-green-700 tracking-wide drop-shadow">Withdraw Requests</h2>
      <div className="space-y-6">
        {requests.length === 0 && (
          <div className="text-center text-gray-400 py-12 text-lg">No withdrawal requests found.</div>
        )}
        {requests.map(r => (
          <div key={r._id} className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 flex flex-col md:flex-row md:items-center md:justify-between transition hover:shadow-2xl">
            <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-3">
                <FaUserCircle className="text-4xl text-blue-400" />
                <div>
                  <div className="font-bold text-2xl text-green-700">₹{r.amount}</div>
                  <div className="text-gray-700 text-base font-medium">{r.user?.name || 'Unknown'} <span className="text-xs text-gray-400">({r.user?.email || '-'})</span></div>
                </div>
              </div>
              <div className="ml-2 text-gray-500 text-xs mt-1 md:mt-0">{new Date(r.requestedAt).toLocaleString()}</div>
              {r.bankSnapshot && (
                <div className="text-xs text-gray-500 mt-1 md:mt-0 md:ml-6">
                  <div><span className="font-semibold text-gray-600">Bank:</span> {r.bankSnapshot.bankName || '-'}</div>
                  <div><span className="font-semibold text-gray-600">Acc:</span> {r.bankSnapshot.accountNumber || '-'}</div>
                  <div><span className="font-semibold text-gray-600">IFSC:</span> {r.bankSnapshot.ifsc || '-'}</div>
                  <div><span className="font-semibold text-gray-600">Holder:</span> {r.bankSnapshot.accountHolder || '-'}</div>
                </div>
              )}
            </div>
            <div className="mt-4 md:mt-0 md:ml-8 flex gap-3 items-center justify-end">
              <span className={`px-4 py-1 rounded-full text-white font-semibold text-base capitalize shadow ${r.status === "Pending" ? "bg-yellow-500" : r.status === "Approved" ? "bg-green-600" : "bg-red-500"}`}>
                {r.status === 'Approved' ? <FaCheckCircle className="inline mr-1 mb-1" /> : r.status === 'Rejected' ? <FaTimesCircle className="inline mr-1 mb-1" /> : null}
                {r.status}
              </span>
              {r.status === 'Pending' && <>
                <button onClick={() => approve(r._id)} className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:from-green-500 hover:to-green-700 transition">Approve</button>
                <button onClick={() => reject(r._id)} className="bg-gradient-to-r from-red-400 to-red-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:from-red-500 hover:to-red-700 transition">Reject</button>
              </>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
