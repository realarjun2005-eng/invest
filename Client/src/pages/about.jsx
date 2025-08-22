
import { FaCar, FaHome, FaUser, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-300 to-green-500 pb-20 text-gray-900">
      <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-green-700">About InvestPro</h2>
        <p className="mb-4 text-gray-700">
          InvestPro is a modern investment platform designed to help you grow your wealth securely and efficiently. Our mission is to make investing simple, transparent, and rewarding for everyone.
        </p>
        <ul className="text-left text-gray-600 mb-4 list-disc list-inside">
          <li>Easy and secure investments</li>
          <li>Referral rewards and team building</li>
          <li>Admin-approved recharges and withdrawals</li>
          <li>Daily check-in bonuses</li>
        </ul>
        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} InvestPro. All rights reserved.</p>
      </div>
      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
        <FooterItem icon={<FaHome />} label="Home" onClick={() => navigate('/home')} />
        <FooterItem icon={<FaCar />} label="Products" onClick={() => navigate('/products')} />
        <FooterItem icon={<FaUsers />} label="Team" onClick={() => navigate('/team')} />
        <FooterItem icon={<FaUser />} label="Profile" onClick={() => navigate('/profile')} />
      </footer>
    </div>
  );
}

function FooterItem({ icon, label, active, onClick }) {
  return (
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
}
