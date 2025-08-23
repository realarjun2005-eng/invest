import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
const IncomeRecord = () => {
  const [page, setPage] = useState(1);
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [records, setRecords] = useState([]);
  const [todayTotal, setTodayTotal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        if (!token) return;
        
        // Fetch today's total income
        const todayRes = await api.get('/api/income/today-total', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTodayTotal(todayRes.data);
        
        // Fetch paginated records
        const res = await api.get(`/api/income/perday?page=${page}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Support both array and object response
        let data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setRecords(data);
        setHasPrev(page > 1);
        setHasNext(data.length === 10); // assuming 10 per page
      } catch (err) {
        setRecords([]);
        setTodayTotal(null);
        setHasPrev(page > 1);
        setHasNext(false);
      }
    };
    fetchRecords();
  }, [page]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-yellow-50 p-4">
      <div className="flex items-center mb-4">
        <button onClick={() => navigate(-1)} className="mr-2 text-green-600 text-xl"><FaArrowLeft /></button>
        <h2 className="text-2xl font-bold text-green-700">Income Record (Per Day)</h2>
      </div>
      
      {/* Today's Total Income Card */}
      {todayTotal && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-4 mb-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Today's Total Income</h3>
              <p className="text-sm opacity-90">{todayTotal.date}</p>
              {todayTotal.entries && todayTotal.entries.length > 0 && (
                <div className="mt-2 text-xs opacity-75">
                  <p>Breakdown:</p>
                  {todayTotal.entries.map((entry, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{entry.productName} (Day {entry.incomeDay}/{entry.totalDays})</span>
                      <span>₹{entry.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">₹{todayTotal.totalIncome}</div>
              <p className="text-sm opacity-90">{todayTotal.entriesCount} payments received</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-md p-4">
        {records.length === 0 ? (
          <p className="text-center text-gray-500">No income records found.</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-green-100">
                  <th className="py-2 px-2">Date & Time</th>
                  <th className="py-2 px-2">Amount</th>
                  <th className="py-2 px-2">Source</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-1 px-2">
                      <div>{new Date(rec.date).toLocaleDateString('en-IN', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric' 
                      })}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(rec.date).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </div>
                    </td>
                    <td className="py-1 px-2 text-green-700 font-semibold">₹{rec.amount}</td>
                    <td className="py-1 px-2">{rec.source || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded text-green-700 font-semibold disabled:opacity-50"
                onClick={() => setPage(page - 1)}
                disabled={!hasPrev}
              >Previous</button>
              <span className="text-gray-500">Page {page}</span>
              <button
                className="px-4 py-2 bg-gray-200 rounded text-green-700 font-semibold disabled:opacity-50"
                onClick={() => setPage(page + 1)}
                disabled={!hasNext}
              >Next</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IncomeRecord;
