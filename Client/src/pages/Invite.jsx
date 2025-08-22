import { useEffect, useState } from 'react';

export default function Invite() {
  const [inviteCode, setInviteCode] = useState('');
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        if (!token) return;
        const res = await fetch('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.user?.inviteCode) {
          setInviteCode(data.user.inviteCode);
          setLink(`${window.location.origin}/register?invite=${data.user.inviteCode}`);
        }
      } catch {}
    };
    fetchInvite();
  }, []);


  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me on InvestPro!',
        text: 'Register using my invite link and get rewards!',
        url: link
      });
    } else {
      handleCopy();
      alert('Share not supported on this device. Link copied instead.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-300 to-green-500 pb-20 text-gray-900">
      <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-700">Invite Friends</h2>
        <p className="mb-4">Share your invite link below. When someone registers with your link, you'll get rewards!</p>
        {inviteCode ? (
          <>
            <div className="mb-2">
              <span className="font-semibold">Your Invite Code:</span> <span className="text-green-600 font-bold">{inviteCode}</span>
            </div>
            <div className="flex items-center gap-2 justify-center mb-4">
              <input value={link} readOnly className="border rounded px-2 py-1 w-64" />
              <button onClick={handleCopy} className="bg-green-500 text-white px-3 py-1 rounded">{copied ? 'Copied!' : 'Copy'}</button>
              <button onClick={handleShare} className="bg-blue-500 text-white px-3 py-1 rounded">Share</button>
            </div>
          </>
        ) : (
          <p>Loading your invite link...</p>
        )}
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
