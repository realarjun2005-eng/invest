import api from '../api/axios';
import { useEffect, useState } from 'react';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        const res = await api.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        let msg = 'Failed to fetch users';
        if (err.response && err.response.data && err.response.data.message) {
          msg += ': ' + err.response.data.message;
        } else if (err.message) {
          msg += ': ' + err.message;
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-700 tracking-wide drop-shadow">All Users</h2>
      {loading ? (
        <div className="text-center text-lg text-blue-400 animate-pulse py-12">Loading users...</div>
      ) : error ? (
        <div className="text-center text-red-500 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">{error}</div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-400 text-lg">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-2xl shadow-lg">
            <thead>
              <tr className="bg-blue-100 text-blue-700 text-lg">
                <th className="py-3 px-6 border-b">Name</th>
                <th className="py-3 px-6 border-b">Email</th>
                <th className="py-3 px-6 border-b">Role</th>
                <th className="py-3 px-6 border-b">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-green-50 transition">
                  <td className="py-3 px-6 border-b font-semibold text-green-700">{u.name || '-'}</td>
                  <td className="py-3 px-6 border-b text-blue-800">{u.email}</td>
                  <td className="py-3 px-6 border-b">
                      <span className={`px-3 py-1 rounded-full text-white text-sm font-bold shadow-md capitalize ${u.role === 'admin' ? 'bg-blue-500' : 'bg-green-500'}`}>{u.role === 'admin' ? 'Admin' : 'User'}</span>
                  </td>
                  <td className="py-3 px-6 border-b text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewUsers;
