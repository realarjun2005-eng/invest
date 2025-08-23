import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaCar, FaHome, FaUser, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import reactLogo from '../assets/react.svg';
import api from '../api/axios';
const Products = () => {
  // Helper to get image src or fallback
  const getProductImage = (img) => {
    if (img && typeof img === 'string' && img.trim()) {
      return img;
    }
    return reactLogo;
  };
  const [plans, setPlans] = useState([]);
  const [planType, setPlanType] = useState('daily');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/api/products', {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setPlans(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchPlans();
  }, []);

  const handleInvest = async (productId) => {
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) {
      alert('You must be logged in to invest.');
      return;
    }
    try {
      await api.post(`/api/invest/${productId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert('Investment successful!');
      // Optionally, update balance in localStorage or refetch user/profile
      // Optionally, navigate to MyPurchase or update UI
    } catch (err) {
      alert(err.response?.data?.message || 'Error investing in product');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 pb-24">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center text-slate-800 mb-6">Investment Portfolio</h1>
          <div className="flex justify-center">
            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg shadow-inner">
              <button
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                  planType === 'daily' 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'
                }`}
                onClick={() => setPlanType('daily')}
              >
                Daily Investment
              </button>
              <button
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                  planType === 'quick' 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'
                }`}
                onClick={() => setPlanType('quick')}
              >
                Quick Investment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Container */}
      <div className="p-4">
        <div className="space-y-8 max-w-4xl mx-auto">
          {(Array.isArray(plans) ? plans.filter(p => (p.planType || 'daily') === planType) : []).map((plan, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="lg:w-1/2 bg-gradient-to-br from-slate-50 to-gray-100 p-6 relative flex items-center justify-center">
                  <div className="w-full max-w-lg">
                    <img
                      src={getProductImage(plan.image)}
                      alt={plan.title}
                      className="w-full h-64 sm:h-72 lg:h-80 object-cover rounded-2xl shadow-xl border-2 border-white hover:scale-105 transition-transform duration-300"
                      onError={e => { e.target.onerror = null; e.target.src = reactLogo; }}
                    />
                  </div>
                  {plan.offer && (
                    <div className="absolute top-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-0">
                      {plan.offer}
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="lg:w-1/2 p-6 flex flex-col justify-center">
                  <div className="text-center lg:text-left mb-6">
                    <div className="text-lg text-slate-600 font-medium mb-2">Investment Opportunity</div>
                    <div className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
                      ₹{plan.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-500 font-medium">Product Price</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 w-full mb-8">
                    <div className="text-center bg-slate-50 border border-slate-200 rounded-lg p-4 hover:bg-slate-100 transition-colors">
                      <div className="font-bold text-slate-800 text-xl mb-1">₹{plan.dailyIncome}</div>
                      <div className="font-medium text-slate-600 text-sm">Daily Returns</div>
                    </div>
                    <div className="text-center bg-emerald-50 border border-emerald-200 rounded-lg p-4 hover:bg-emerald-100 transition-colors">
                      <div className="font-bold text-emerald-700 text-xl mb-1">₹{plan.totalIncome}</div>
                      <div className="font-medium text-emerald-600 text-sm">Total Returns</div>
                    </div>
                    <div className="text-center bg-indigo-50 border border-indigo-200 rounded-lg p-4 hover:bg-indigo-100 transition-colors">
                      <div className="font-bold text-indigo-700 text-xl mb-1">{plan.days}</div>
                      <div className="font-medium text-indigo-600 text-sm">Investment Period</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInvest(plan._id)}
                    className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-semibold w-full py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 border border-slate-700"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Invest Now
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Footer Nav */}
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 shadow-lg">
          <FooterItem icon={<FaHome />} label="Home" onClick={() => navigate('/home')} />
          <FooterItem icon={<FaCar />} label="Products" active />
          <FooterItem icon={<FaUsers />} label="Team" onClick={() => navigate('/team')} />
          <FooterItem icon={<FaUser />} label="Profile" onClick={() => navigate('/profile')} />
        </footer>
      </div>
    </div>
  );
};

const FooterItem = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex flex-col items-center text-xs cursor-pointer transition-all duration-300 py-2 px-3 rounded-lg ${
      active 
        ? 'text-slate-800 bg-slate-100 scale-105' 
        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
    }`}
  >
    <div className={`text-xl mb-1 ${active ? 'animate-bounce' : ''}`}>{icon}</div>
    <span className="font-medium">{label}</span>
  </div>
);

export default Products;
