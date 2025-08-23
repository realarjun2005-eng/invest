import { useEffect, useState } from 'react';

export default function Checkin() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [lastCheckin, setLastCheckin] = useState(null);

  useEffect(() => {
    // Optionally fetch last check-in status from backend
    fetch('https://invest-2-9yoa.onrender.com/api/checkin/status', {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setCheckedIn(data.checkedInToday);
        setLastCheckin(data.lastCheckin);
      })
      .catch(() => {});
  }, []);

  const handleCheckin = async () => {
    setMessage('');
    try {
      const res = await fetch('https://invest-2-9yoa.onrender.com/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setCheckedIn(true);
        setLastCheckin(data.date);
        setMessage(data.message || `Check-in successful! You received ₹${data.reward || 5}.`);
      } else {
        setMessage(data.message || 'Check-in failed');
      }
    } catch {
      setMessage('Check-in failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-300 to-green-500 pb-20 text-gray-900">
      <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-700">Daily Check-in</h2>
        {checkedIn ? (
          <div>
            <p className="text-green-600 font-semibold mb-2">You have already checked in today!</p>
            {lastCheckin && <p className="text-gray-500 text-sm">Last check-in: {new Date(lastCheckin).toLocaleString()}</p>}
          </div>
        ) : (
          <button
            onClick={handleCheckin}
            className="bg-gradient-to-r from-green-400 to-lime-400 text-white px-6 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform font-bold"
          >
            Check In Now
          </button>
        )}
        {message && <div className="mt-4 text-green-600 font-semibold">{message}</div>}
      </div>
      {/* Footer Navigation */}
      <Footer />
    </div>
  );
}

import { FaCar, FaHome, FaUser, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
      <FooterItem icon={<FaHome />} label="Home" onClick={() => navigate('/home')} />
      <FooterItem icon={<FaCar />} label="Products" onClick={() => navigate('/products')} />
      <FooterItem icon={<FaUsers />} label="Team" onClick={() => navigate('/team')} />
      <FooterItem icon={<FaUser />} label="Profile" onClick={() => navigate('/profile')} />
    </footer>
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
