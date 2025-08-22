import { useEffect, useState } from 'react';
import { FaBell, FaBuilding } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return Boolean(JSON.parse(localStorage.getItem('user'))?.token);
    } catch { return false; }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        setIsLoggedIn(Boolean(JSON.parse(localStorage.getItem('user'))?.token));
      } catch { setIsLoggedIn(false); }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Also update state on mount in case login happens in same tab
  useEffect(() => {
    try {
      setIsLoggedIn(Boolean(JSON.parse(localStorage.getItem('user'))?.token));
    } catch { setIsLoggedIn(false); }
  }, []);

  // Get user from localStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {}

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-green-300 via-lime-200 to-green-400 rounded-b-2xl shadow-2xl border-b border-green-500">
      <Link to="/" className="text-2xl font-extrabold text-green-900 tracking-wide drop-shadow-lg hover:text-green-700 transition-colors duration-200">InvestPro</Link>
      <div className="space-x-4 flex items-center">
        {isLoggedIn ? (
          <>
            <Link to="/about" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-100 transition">
              <FaBuilding className="text-green-700 text-xl drop-shadow" title="About Company" />
              <span className="hidden sm:inline font-semibold text-green-900">About</span>
            </Link>
            <Link to="/notifications" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-100 transition">
              <FaBell className="text-yellow-500 text-xl drop-shadow" title="Notifications" />
              <span className="hidden sm:inline font-semibold text-green-900">Notifications</span>
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 transition font-bold text-yellow-700 border border-yellow-300">
                <span className="hidden sm:inline">Admin Dashboard</span>
              </Link>
            )}
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-gradient-to-r from-green-400 to-lime-400 text-white px-5 py-2 rounded-xl font-bold shadow-lg hover:scale-105 hover:from-green-500 hover:to-lime-500 transition-all duration-200 border-2 border-green-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white border-2 border-green-400 text-green-700 px-5 py-2 rounded-xl font-bold shadow-lg hover:bg-green-50 hover:scale-105 transition-all duration-200"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;