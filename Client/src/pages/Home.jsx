import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { FaCar, FaCheckCircle, FaHome, FaMoneyBillWave, FaUser, FaUserPlus, FaUsers, FaWallet } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import bannerImage from '../assets/banner.jpg'; // Example banner imagee poster image   

const Home = () => {
  // Buy offer product
  const handleBuyOffer = async () => {
    if (!offer || !offer._id) return;
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) {
      alert('You must be logged in to purchase.');
      return;
    }
    try {
      await axios.post(`/api/invest/${offer._id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert('Product purchased successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error purchasing product');
    }
  };
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (transactions.length > 3) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % transactions.length);
      }, 500);
      return () => clearInterval(intervalRef.current);
    }
  }, [transactions]);

  const fetchData = async () => {
    try {
      const offerRes = await axios.get('/api/home/offer'); // mock endpoint
      const txnRes = await axios.get('/api/home/transactions');
      setOffer(offerRes.data);
      setTransactions(txnRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-300 via-lime-200 to-green-500 text-gray-900 flex flex-col justify-between">
      {/* Banner */}
      <div className="p-4 flex justify-center">
        <img
          src={bannerImage}
          alt="OLA Banner"
          className="w-full max-w-lg rounded-2xl shadow-xl border-2 border-gray-300"
        />
      </div>

      {/* Icons Menu */}
      <div className="flex justify-around py-4 gap-2">
        <MenuIcon icon={<FaCheckCircle />} label="Checkin" onClick={() => navigate('/checkin')} color="bg-green-400" />
        <MenuIcon icon={<FaUserPlus />} label="Invite" onClick={() => navigate('/invite')} color="bg-yellow-400" />
        <MenuIcon icon={<FaMoneyBillWave />} label="Recharge" onClick={() => navigate('/recharge')} color="bg-blue-400" />
        <MenuIcon icon={<FaWallet />} label="Withdraw" onClick={() => navigate('/withdraw')} color="bg-pink-400" />
      </div>

      {/* Offer Card */}
      {offer && (
        <div className="mx-4 bg-white rounded-2xl shadow-2xl p-4 mb-8 border-2 border-green-300 animate-fade-in">
          <h2 className="font-extrabold text-xl md:text-2xl mb-4 text-green-700 text-center">Special Plan</h2>
          <div className="flex flex-col items-center gap-4">
            <img
              src={offer.image || bannerImage}
              alt={offer.name || "Special Offer"}
              className="rounded-xl w-full max-w-[280px] h-[160px] object-cover border-2 border-gray-200 shadow-lg"
              onError={(e) => {
                e.target.src = bannerImage;
              }}
            />
            <div className="w-full text-center space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm md:text-base">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-gray-600">Duration</p>
                  <p className="font-bold text-green-600 text-lg">{offer.offerPeriod || offer.cycle || 'N/A'} days</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-gray-600">Price</p>
                  <p className="font-bold text-yellow-600 text-lg">₹{offer.price}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg">
                  <p className="text-gray-600">Daily Profit</p>
                  <p className="font-bold text-pink-600 text-lg">₹{offer.dailyProfit}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-600">Total Revenue</p>
                  <p className="font-bold text-blue-600 text-lg">₹{offer.totalRevenue}</p>
                </div>
              </div>
              <button
                className="w-full bg-gradient-to-r from-green-400 to-lime-400 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform font-semibold text-lg"
                onClick={handleBuyOffer}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transactions - Rotating 3 at a time */}
      <div className="px-4 text-base text-white mb-24 space-y-2 h-48 overflow-hidden relative">
        {Array.isArray(transactions) && transactions.length > 0 &&
          transactions
            .slice(currentIndex, currentIndex + 3)
            .concat(
              currentIndex + 3 > transactions.length
                ? transactions.slice(0, (currentIndex + 3) % transactions.length)
                : []
            )
            .map((txn, i) => (
              <p
                key={i + currentIndex}
                className="bg-gradient-to-r from-yellow-300 via-green-200 to-green-400 bg-opacity-40 rounded-xl p-3 shadow-md flex items-center gap-2 animate-fade-in mb-2 h-16"
                style={{ minHeight: '4rem' }}
              >
                <span className="text-2xl">🚕</span>
                <span>{txn.message}</span>
              </p>
            ))
        }
      </div>

      {/* Footer Nav */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow-lg">
        <FooterItem icon={<FaHome />} label="Home" active onClick={() => navigate('/home')} />
        <FooterItem icon={<FaCar />} label="Products" onClick={() => navigate('/products')} />
        <FooterItem icon={<FaUsers />} label="Team" onClick={() => navigate('/team')} />
        <FooterItem icon={<FaUser />} label="Profile" onClick={() => navigate('/profile')} />
      </footer>
    </div>
  );
};

const MenuIcon = ({ icon, label, onClick, color }) => (
  <div className="flex flex-col items-center text-sm cursor-pointer group" onClick={onClick}>
    <div className={`w-14 h-14 ${color} rounded-full flex items-center justify-center mb-1 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
      <span className="text-2xl text-white">{icon}</span>
    </div>
    <p className="font-semibold group-hover:text-green-700 transition-colors duration-200">{label}</p>
  </div>
);

const FooterItem = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex flex-col items-center text-xs cursor-pointer ${
      active ? 'text-yellow-500' : 'text-gray-500'
    }`}
  >
    <div className="text-xl">{icon}</div>
    <span>{label}</span>
  </div>
);

export default Home;