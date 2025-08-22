import { FaChartLine } from "react-icons/fa";

const Welcome = () => (
  <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-green-300 via-lime-200 to-green-500 text-gray-900 overflow-hidden">
    {/* Decorative gradient circles */}
    <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full opacity-30 blur-2xl animate-pulse" />
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl animate-pulse" />
    <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-blue-500 rounded-full opacity-10 blur-2xl animate-pulse" style={{transform: 'translate(-50%, -50%)'}} />

    <div className="relative z-10 bg-white bg-opacity-90 rounded-2xl shadow-2xl p-10 flex flex-col items-center max-w-xl mx-auto">
      <FaChartLine className="text-blue-600 text-7xl mb-6 animate-bounce drop-shadow-lg" />
      <h1 className="text-5xl font-extrabold text-blue-800 mb-4 drop-shadow-lg text-center">Welcome to InvestPro</h1>
      <p className="text-xl text-gray-700 mb-6 text-center max-w-md">
        <span className="font-semibold text-blue-600">Smart investments, brighter future.</span><br />
        Join us to explore products, track your portfolio, and stay updated with the latest market trends!
      </p>
      <div className="flex flex-col items-center mt-6">
        <a href="/register" className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition-all duration-200">Get Started</a>
        <div className="mt-8 text-center">
          <blockquote className="italic text-blue-900 text-lg animate-fade-in-slow">
            "The best investment you can make is in yourself."
          </blockquote>
          <span className="block mt-2 text-gray-500 text-sm">- Warren Buffett</span>
        </div>
      </div>
    </div>
  </div>
);

export default Welcome;
