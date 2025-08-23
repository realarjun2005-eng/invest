import { useEffect, useState } from "react";

const WithdrawRecord = () => {
  // Get token from user object in localStorage
  let token = null;
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const userObj = JSON.parse(userStr);
      token = userObj.token;
    } catch (e) {
      token = null;
    }
  }
  const [amount, setAmount] = useState("");
  const [records, setRecords] = useState([]);
  const [available, setAvailable] = useState(null);
  const [totalIncome, setTotalIncome] = useState(null);
  const [netIncome, setNetIncome] = useState(null);

  useEffect(() => {
    // Fetch withdrawal records
    fetch("https://invest-2-9yoa.onrender.com/api/withdraw", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setRecords(data))
      .catch(err => console.log(err));
    // Fetch available withdrawable amount and net income
    fetch("https://invest-2-9yoa.onrender.com/api/withdraw/available", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setAvailable(data.available);
        setTotalIncome(data.totalIncome);
        setNetIncome(data.netIncome);
      })
      .catch(err => {
        setAvailable(null);
        setTotalIncome(null);
        setNetIncome(null);
      });
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://invest-2-9yoa.onrender.com/api/withdraw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ amount })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.withdraw) {
          alert("Withdraw requested");
          setAmount("");
          setRecords([data.withdraw, ...records]);
          // Refetch available amount and net income
          fetch("https://invest-2-9yoa.onrender.com/api/withdraw/available", {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(data => {
              setAvailable(data.available);
              setTotalIncome(data.totalIncome);
              setNetIncome(data.netIncome);
            })
            .catch(err => {
              setAvailable(null);
              setTotalIncome(null);
              setNetIncome(null);
            });
        } else {
          alert(data.message || "Withdraw failed");
        }
      })
      .catch(err => {
        console.log(err);
        alert("Withdraw failed");
      });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Withdraw Request</h2>
      <div className="mb-4 text-lg font-semibold text-blue-700">
        <div>Total Income: {totalIncome !== null ? `₹${totalIncome}` : <span className="text-gray-400">Loading...</span>}</div>
        <div>Available to withdraw: {available !== null ? `₹${available}` : <span className="text-gray-400">Loading...</span>}</div>
        {available !== null && totalIncome !== null && (
          <div className="mt-2 text-sm text-gray-600">
            <div>Calculation: ₹{totalIncome} (Total) - ₹{totalIncome - available} (Withdrawn/Pending) = ₹{available} (Available)</div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 border rounded px-4 py-2"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Request
        </button>
      </form>
      <h3 className="text-xl font-semibold mb-2">Your Withdrawal Records</h3>
      <div className="space-y-4">
        {records.length === 0 && (
          <div className="text-center py-4 text-gray-500">No records found</div>
        )}
        {records.map((record) => (
          <div key={record._id} className="bg-gray-50 rounded-xl shadow flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200">
            <div className="flex-1">
              <div className="font-bold text-lg text-green-700">₹{record.amount}</div>
              <div className="text-gray-600 text-sm">{new Date(record.requestedAt).toLocaleString()}</div>
              {record.bankSnapshot && (
                <div className="text-xs text-gray-500 mt-1">
                  <div>Bank: {record.bankSnapshot.bankName || '-'}</div>
                  <div>Acc: {record.bankSnapshot.accountNumber || '-'}</div>
                  <div>IFSC: {record.bankSnapshot.ifsc || '-'}</div>
                </div>
              )}
            </div>
            <div className="mt-2 md:mt-0 md:ml-4 flex items-center">
              <span className={`px-3 py-1 rounded-full text-white font-semibold text-sm ${["Pending", "pending"].includes(record.status) ? "bg-yellow-500" : ["Approved", "approved"].includes(record.status) ? "bg-green-600" : "bg-red-500"}`}>
                {["Approved", "approved"].includes(record.status) ? "Completed" : record.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WithdrawRecord;
