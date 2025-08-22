import { FaChartBar, FaMoneyCheckAlt, FaPlusCircle, FaQrcode, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-yellow-50 to-green-200 py-10 px-2">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        <h2 className="text-3xl font-extrabold text-green-700 mb-8 flex items-center gap-3">
          <FaChartBar className="text-green-400 animate-pulse" /> Admin Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/admin/users" className="bg-green-50 rounded-xl p-6 shadow hover:shadow-lg transition flex flex-col items-center group">
            <FaUsers className="text-3xl text-green-600 mb-2 group-hover:scale-110 transition" />
            <span className="font-bold text-green-700 mb-1">View Users</span>
            <span className="text-gray-500 text-sm">Manage all users</span>
          </Link>
          <Link to="/admin/add-product" className="bg-yellow-50 rounded-xl p-6 shadow hover:shadow-lg transition flex flex-col items-center group">
            <FaPlusCircle className="text-3xl text-yellow-500 mb-2 group-hover:scale-110 transition" />
            <span className="font-bold text-yellow-700 mb-1">Add Product</span>
            <span className="text-gray-500 text-sm">Add new investment products</span>
          </Link>
          <Link to="/admin/offer-product" className="bg-pink-50 rounded-xl p-6 shadow hover:shadow-lg transition flex flex-col items-center group">
            <FaChartBar className="text-3xl text-pink-500 mb-2 group-hover:scale-110 transition" />
            <span className="font-bold text-pink-700 mb-1">Offer Product</span>
            <span className="text-gray-500 text-sm">Create or update offer plan</span>
          </Link>
          <Link to="/admin/withdraws" className="bg-blue-50 rounded-xl p-6 shadow hover:shadow-lg transition flex flex-col items-center group">
            <FaMoneyCheckAlt className="text-3xl text-blue-600 mb-2 group-hover:scale-110 transition" />
            <span className="font-bold text-blue-700 mb-1">Approve Withdrawals</span>
            <span className="text-gray-500 text-sm">Review and approve requests</span>
          </Link>
          <Link to="/admin/recharge-requests" className="bg-purple-50 rounded-xl p-6 shadow hover:shadow-lg transition flex flex-col items-center group">
            <FaQrcode className="text-3xl text-purple-600 mb-2 group-hover:scale-110 transition" />
            <span className="font-bold text-purple-700 mb-1">Approve Recharges</span>
            <span className="text-gray-500 text-sm">Review and approve recharge requests</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
