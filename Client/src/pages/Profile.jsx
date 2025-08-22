import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaCar, FaDownload, FaHome, FaMoneyBillWave, FaQuestionCircle, FaRegFileAlt, FaSignOutAlt, FaUser, FaUsers, FaWallet } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import poster from '../assets/react.svg'; // Use an existing image asset
import BankCard from '../components/BankCard';
const Profile = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  // Fetch user data from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const res = await axios.get('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchUser();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('user');
    // Notify all tabs and components of login state change
    window.dispatchEvent(new Event('user-login-state'));
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-300 to-yellow-100 p-4">
      {/* Header */}
      <div className="bg-green-500 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{user?.name || user?.email || 'User'}</h2>
          <p className="text-sm">{user?.email || 'No email'}</p>
        </div>
        <img src={poster} alt="App Logo" className="w-10 h-10 rounded-full" />
      </div>

      {/* Bank Info */}
      <div className="my-2">
        <BankCard />
      </div>

      {/* Wallet Stats */}
      <div className="bg-white shadow-md rounded-b-xl p-4 flex justify-around text-center my-2">
        <div>
          <p className="text-green-600 font-bold">₹{user?.balance || 10}</p>
          <p className="text-sm text-gray-500">Balance</p>
        </div>
        <div>
          <p className="text-green-600 font-bold">₹{user?.recharge || 0}</p>
          <p className="text-sm text-gray-500">Recharge</p>
        </div>
        <div>
          <p className="text-green-600 font-bold">₹{user?.totalEarning || 0}</p>
          <p className="text-sm text-gray-500">Total Earning</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-around my-4">
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-full shadow-md"
          onClick={() => navigate('/recharge')}
        >
          Recharge
        </button>
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-full shadow-md"
          onClick={() => navigate('/withdraw')}
        >
          Withdraw
        </button>
      </div>

      {/* Menu Options */}
      <div className="bg-white rounded-xl shadow-md divide-y divide-gray-200">
        <Item icon={<FaWallet />} title="My Purchase" onClick={() => navigate('/purchase')} />
        <Item icon={<FaUser />} title="Account Details" onClick={() => navigate('/account-details')} />
        <Item icon={<FaMoneyBillWave />} title="Withdraw Record" onClick={() => navigate('/withdraw')} />
        <Item icon={<FaRegFileAlt />} title="Income Record" onClick={() => navigate('/income-record')} />
        <Item icon={<FaQuestionCircle />} title="Help Center" onClick={() => navigate('/help-center')} />
        <Item icon={<FaDownload />} title="Download App" onClick={() => window.open('https://play.google.com/store', '_blank')} />
      </div>

      {/* Logout */}
      <div className="flex justify-center mt-8 mb-24">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 border-2 border-yellow-400 text-lg"
        >
          <FaSignOutAlt className="text-xl" />
          Logout
        </button>
      </div>
    {/* Footer Nav */}
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
      <FooterItem icon={<FaHome />} label="Home" onClick={() => navigate('/home')} />
      <FooterItem icon={<FaCar />} label="Products" onClick={() => navigate('/products')} />
      <FooterItem icon={<FaUsers />} label="Team" onClick={() => navigate('/team')} />
      <FooterItem icon={<FaUser />} label="Profile" active onClick={() => navigate('/profile')} />
    </footer>
  </div>
  );
};

const Item = ({ icon, title, onClick }) => (
  <div className="flex items-center p-4 hover:bg-gray-100 cursor-pointer" onClick={onClick}>
    <div className="text-green-600 text-xl mr-3">{icon}</div>
    <span className="text-gray-800">{title}</span>
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

export default Profile;
