import { useEffect, useState } from 'react';
import { registerUser } from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', invite: '' });
  // Autofill invite code from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invite = params.get('invite');
    if (invite) setFormData(f => ({ ...f, invite }));
  }, []);
  // Math captcha state
  const [captcha, setCaptcha] = useState({ a: Math.floor(Math.random() * 10), b: Math.floor(Math.random() * 10) });
  const [captchaInput, setCaptchaInput] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check captcha
    if (parseInt(captchaInput) !== captcha.a + captcha.b) {
      setMessage('Captcha answer is incorrect.');
      setCaptcha({ a: Math.floor(Math.random() * 10), b: Math.floor(Math.random() * 10) });
      setCaptchaInput('');
      return;
    }
    try {
      const res = await registerUser(formData);
      setMessage(res.message);
    } catch (err) {
      setMessage(
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred"
      );
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
        <h2 className="text-3xl font-extrabold text-green-700 mb-2 drop-shadow text-center">Create Your Account</h2>
        <p className="text-gray-600 mb-6 text-center">Join InvestPro and start your journey to financial growth!</p>
        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          <input name="name" type="text" placeholder="Name" className="w-full p-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition" onChange={handleChange} required autoComplete="name" />
          <input name="email" type="email" placeholder="Email" className="w-full p-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition" onChange={handleChange} required autoComplete="email" />
          <input name="password" type="password" placeholder="Password" className="w-full p-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition" onChange={handleChange} required autoComplete="current-password" />
          <input name="invite" type="text" placeholder="Referral/Invite Code (optional)" value={formData.invite} onChange={handleChange} className="w-full p-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition" autoComplete="off" />
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
          <button type="submit" className="w-full bg-gradient-to-r from-green-400 to-lime-400 text-white py-3 rounded-xl font-bold shadow-lg hover:scale-105 hover:from-green-500 hover:to-lime-500 transition-all duration-200 border-2 border-green-300">Register</button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
        <div className="mt-6 text-center text-gray-700">
          Already have an account?{' '}
          <a href="/login" className="text-green-600 font-semibold underline hover:text-green-800 transition">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
