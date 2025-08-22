import { useEffect, useState } from 'react';
import { FaCar, FaHome, FaUser, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Team = () => {
  const [team, setTeam] = useState({ level1: [], level2: [], level3: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const res = await fetch('/api/team/hierarchy', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch team');
        const data = await res.json();
        setTeam({
          level1: data.level1 || [],
          level2: data.level2 || [],
          level3: data.level3 || []
        });
      } catch (err) {
        console.error('Fetch Error:', err.message);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 pb-20 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent text-center drop-shadow-lg tracking-wide">My Team 🚀</h2>

        {/* Team Members List by Level */}
        <div className="bg-gradient-to-br from-white via-emerald-50 to-teal-50 rounded-2xl shadow-2xl border border-emerald-200 p-8 backdrop-blur-lg">
          <h3 className="text-xl font-bold mb-4 text-emerald-700 border-l-4 border-emerald-500 pl-3 bg-gradient-to-r from-emerald-100 to-emerald-50 py-3 rounded-r-xl shadow-sm">🔥 Level 1 Referrals</h3>
          {team.level1.length === 0 ? <p className="text-gray-500 italic text-center py-4">No direct referrals yet. Start inviting friends!</p> : (
            <ul className="space-y-3">
              {team.level1.map((member, idx) => (
                <li key={member._id || idx} className="flex justify-between items-center border-b border-emerald-100 py-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100 transition-all duration-300 rounded-lg px-3">
                  <span className="font-semibold text-gray-800">{member.name} <span className="text-xs text-emerald-500 font-normal">({member.email})</span></span>
                  <span className="text-xs text-gray-600 ml-2 bg-gray-100 px-2 py-1 rounded">Invited By: {member.invitedBy || 'N/A'}</span>
                  <span className="text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full font-medium shadow-md">Level 1</span>
                </li>
              ))}
            </ul>
          )}
          <h3 className="text-xl font-bold mt-8 mb-4 text-teal-700 border-l-4 border-teal-500 pl-3 bg-gradient-to-r from-teal-100 to-teal-50 py-3 rounded-r-xl shadow-sm">⭐ Level 2 Referrals</h3>
          {team.level2.length === 0 ? <p className="text-gray-500 italic text-center py-4">No level 2 referrals yet. Keep growing your network!</p> : (
            <ul className="space-y-3">
              {team.level2.map((member, idx) => (
                <li key={member._id || idx} className="flex justify-between items-center border-b border-teal-100 py-3 hover:bg-gradient-to-r hover:from-teal-50 hover:to-teal-100 transition-all duration-300 rounded-lg px-3">
                  <span className="font-semibold text-gray-800">{member.name} <span className="text-xs text-teal-500 font-normal">({member.email})</span></span>
                  <span className="text-xs text-gray-600 ml-2 bg-gray-100 px-2 py-1 rounded">Invited By: {member.invitedBy || 'N/A'}</span>
                  <span className="text-sm bg-gradient-to-r from-teal-500 to-teal-600 text-white px-3 py-1 rounded-full font-medium shadow-md">Level 2</span>
                </li>
              ))}
            </ul>
          )}
          <h3 className="text-xl font-bold mt-8 mb-4 text-cyan-700 border-l-4 border-cyan-500 pl-3 bg-gradient-to-r from-cyan-100 to-cyan-50 py-3 rounded-r-xl shadow-sm">💎 Level 3 Referrals</h3>
          {team.level3.length === 0 ? <p className="text-gray-500 italic text-center py-4">No level 3 referrals yet. Expand your team further!</p> : (
            <ul className="space-y-3">
              {team.level3.map((member, idx) => (
                <li key={member._id || idx} className="flex justify-between items-center border-b border-cyan-100 py-3 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-cyan-100 transition-all duration-300 rounded-lg px-3">
                  <span className="font-semibold text-gray-800">{member.name} <span className="text-xs text-cyan-500 font-normal">({member.email})</span></span>
                  <span className="text-xs text-gray-600 ml-2 bg-gray-100 px-2 py-1 rounded">Invited By: {member.invitedBy || 'N/A'}</span>
                  <span className="text-sm bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-3 py-1 rounded-full font-medium shadow-md">Level 3</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
        <FooterItem icon={<FaHome />} label="Home" onClick={() => navigate('/home')} />
        <FooterItem icon={<FaCar />} label="Products" onClick={() => navigate('/products')} />
        <FooterItem icon={<FaUsers />} label="Team" active />
        <FooterItem icon={<FaUser />} label="Profile" onClick={() => navigate('/profile')} />
      </footer>
    </div>
  );
};

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

export default Team;
