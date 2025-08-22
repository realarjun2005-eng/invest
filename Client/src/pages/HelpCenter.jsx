

import { FaEnvelope, FaPhoneAlt, FaQuestionCircle, FaRegSmile } from "react-icons/fa";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-green-200 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <FaQuestionCircle className="text-3xl text-green-500 animate-bounce" />
          <h2 className="text-3xl font-extrabold text-green-700 tracking-tight">Help Center</h2>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-yellow-600">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-xl p-4 shadow hover:shadow-lg transition">
              <p className="font-semibold text-green-700 mb-1">How do I purchase a product?</p>
              <p className="text-gray-700 text-sm">Go to the Products page, select a product, and click the purchase button. Your purchase will appear in My Purchases.</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 shadow hover:shadow-lg transition">
              <p className="font-semibold text-green-700 mb-1">How do I add or update my bank details?</p>
              <p className="text-gray-700 text-sm">Go to Account Details from your profile menu and fill in your bank information.</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 shadow hover:shadow-lg transition">
              <p className="font-semibold text-green-700 mb-1">How do I request a withdrawal?</p>
              <p className="text-gray-700 text-sm">Go to Withdraw Record, enter the amount, and submit a request. You can track the status in the same section.</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 shadow hover:shadow-lg transition">
              <p className="font-semibold text-green-700 mb-1">Who do I contact for support?</p>
              <p className="text-gray-700 text-sm">Email us at <a href="mailto:support@investmentapp.com" className="text-blue-600 underline">support@investmentapp.com</a> or use the contact form below.</p>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-4 text-yellow-600">Contact Us</h3>
          <form className="space-y-4 bg-yellow-50 rounded-xl p-6 shadow-md">
            <div className="flex gap-4">
              <input type="text" placeholder="Your Name" className="flex-1 border-2 border-green-200 rounded px-4 py-2 focus:outline-none focus:border-green-400" required />
              <input type="email" placeholder="Your Email" className="flex-1 border-2 border-green-200 rounded px-4 py-2 focus:outline-none focus:border-green-400" required />
            </div>
            <textarea placeholder="Your Message" className="w-full border-2 border-green-200 rounded px-4 py-2 focus:outline-none focus:border-green-400" rows={4} required></textarea>
            <button type="submit" className="w-full bg-gradient-to-r from-green-400 to-yellow-400 text-white font-bold px-6 py-3 rounded-xl shadow hover:from-green-500 hover:to-yellow-500 transition-all duration-200 flex items-center justify-center gap-2">
              <FaRegSmile className="text-lg" /> Send Message
            </button>
          </form>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between mt-8 border-t pt-6">
          <div className="flex items-center gap-2 text-green-700 font-semibold">
            <FaEnvelope className="text-lg" /> support@investmentapp.com
          </div>
          <div className="flex items-center gap-2 text-green-700 font-semibold mt-2 md:mt-0">
            <FaPhoneAlt className="text-lg" /> +91 98765 43210
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
