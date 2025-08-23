import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    ifsc: "",
    upi: ""
  });

  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    if (!token) return navigate("/login");
    fetch("https://invest-2-9yoa.onrender.com/api/account", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.bankName) {
          setFormData(data);
        }
      })
      .catch(err => console.log("Error loading account details", err));
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://invest-2-9yoa.onrender.com/api/account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        alert("Account details updated successfully");
      })
      .catch(err => {
        console.log("Submit error", err);
        alert("Failed to update account");
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-green-400">
      <div className="w-full max-w-md bg-white/90 shadow-2xl rounded-3xl p-8 border border-green-200 backdrop-blur-md">
        <div className="flex flex-col items-center mb-6">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-2 text-green-600"><path d="M3 10v10h18V10M3 10l9-7 9 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <h2 className="text-2xl font-extrabold text-green-700 tracking-tight mb-1">Account Details</h2>
          <p className="text-green-500 text-sm">Manage your bank and UPI information securely</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-green-700 font-semibold mb-1" htmlFor="bankName">Bank Name</label>
            <input
              type="text"
              name="bankName"
              id="bankName"
              placeholder="Enter your bank name"
              value={formData.bankName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400 focus:outline-none transition shadow-sm bg-green-50"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-green-700 font-semibold mb-1" htmlFor="accountNumber">Account Number</label>
            <input
              type="text"
              name="accountNumber"
              id="accountNumber"
              placeholder="Enter your account number"
              value={formData.accountNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400 focus:outline-none transition shadow-sm bg-green-50"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-green-700 font-semibold mb-1" htmlFor="ifsc">IFSC Code</label>
            <input
              type="text"
              name="ifsc"
              id="ifsc"
              placeholder="Enter IFSC code"
              value={formData.ifsc}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400 focus:outline-none transition shadow-sm bg-green-50"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-green-700 font-semibold mb-1" htmlFor="upi">UPI ID</label>
            <input
              type="text"
              name="upi"
              id="upi"
              placeholder="Enter UPI ID"
              value={formData.upi}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400 focus:outline-none transition shadow-sm bg-green-50"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-2.5 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 hover:scale-105 duration-150"
          >
            Save Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountDetails;
