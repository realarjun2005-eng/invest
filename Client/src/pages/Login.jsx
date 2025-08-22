// client/src/pages/Login.jsx
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  // Math captcha state
  const [captcha, setCaptcha] = useState({ a: Math.floor(Math.random() * 10), b: Math.floor(Math.random() * 10) });
  const [captchaInput, setCaptchaInput] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Check captcha
    if (parseInt(captchaInput) !== captcha.a + captcha.b) {
      setError('Captcha answer is incorrect.');
      // Regenerate captcha
      setCaptcha({ a: Math.floor(Math.random() * 10), b: Math.floor(Math.random() * 10) });
      setCaptchaInput('');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token, user } = res.data;
      // 1. ✅ Store token inside user object only
      const userWithToken = { ...user, token };
      localStorage.setItem('user', JSON.stringify(userWithToken));
      // Notify all tabs and components of login state change
      window.dispatchEvent(new Event('user-login-state'));
      // 2. 👀 Show token in console for debugging
      console.log('JWT Token:', token);
      // 3. 🚀 Redirect to dashboard/home
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-300 via-lime-200 to-green-500">
      <div className="max-w-md w-full bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        <div className="mb-4">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-500 animate-bounce">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth={2} />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-green-700 mb-2 drop-shadow text-center">Login to InvestPro</h2>
        <p className="text-gray-600 mb-6 text-center">Access your account and start investing smartly!</p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            required
            autoComplete="email"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            required
            autoComplete="current-password"
          />
          {/* Math Captcha */}
          <div className="flex items-center gap-2">
            <span className="font-semibold">{captcha.a} + {captcha.b} =</span>
            <input
              type="number"
              value={captchaInput}
              onChange={e => setCaptchaInput(e.target.value)}
              className="w-20 p-2 border-2 border-yellow-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
              placeholder="?"
            />
            <button type="button" onClick={() => { setCaptcha({ a: Math.floor(Math.random() * 10), b: Math.floor(Math.random() * 10) }); setCaptchaInput(''); }} className="text-xs text-blue-600 underline ml-2">Refresh</button>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-lime-400 text-white py-3 rounded-xl font-bold shadow-lg hover:scale-105 hover:from-green-500 hover:to-lime-500 transition-all duration-200 border-2 border-green-300"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center text-gray-700">
          Don't have an account?{' '}
          <a href="/register" className="text-green-600 font-semibold underline hover:text-green-800 transition">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
