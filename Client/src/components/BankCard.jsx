import axios from 'axios';
import { useEffect, useState } from 'react';
import api from '../api/axios';
const BankCard = () => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const res = await api.get('/api/account', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDetails(res.data);
      } catch (err) {
        setError('No account details found');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  if (loading) return <div className="mb-4">Loading bank details...</div>;
  if (error) return <div className="mb-4 text-red-500">{error}</div>;
  if (!details) return null;

  return (
    <div className="bg-blue-100 rounded-lg shadow p-4 mb-6">
      <h4 className="font-bold mb-2">Bank Account Details</h4>
      <div><span className="font-semibold">Bank Name:</span> {details.bankName}</div>
      <div><span className="font-semibold">Account Number:</span> {details.accountNumber}</div>
      <div><span className="font-semibold">IFSC:</span> {details.ifsc}</div>
      <div><span className="font-semibold">UPI:</span> {details.upi}</div>
    </div>
  );
};

export default BankCard;
