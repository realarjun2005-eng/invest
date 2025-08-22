import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaCar, FaHome, FaUser, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MyPurchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const res = await axios.get('/api/mypurchases', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPurchases(res.data || []);
      } catch (err) {
        setError('Failed to load purchases');
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-yellow-100 pb-24">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">My Purchases</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : purchases.length === 0 ? (
          <p>No purchases found.</p>
        ) : (
          <div className="space-y-6">
            {purchases.map((purchase, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row items-center gap-4">
                <img 
                  src={purchase.product?.image} 
                  alt={purchase.product?.title} 
                  className="w-32 h-20 object-cover rounded-lg border border-gray-200 shadow-sm" 
                />
                <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{purchase.product?.title}</h3>
                    <div className="text-green-600 text-sm font-semibold mb-1">{purchase.product?.offer}</div>
                    <div className="text-md mb-2 font-medium">
                      Product Price: <span className="text-green-500">Rs {purchase.product?.price}</span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-700 mb-2">
                      <div>Daily Income: <span className="font-semibold">Rs {purchase.product?.dailyIncome}</span></div>
                      <div>Total Income: <span className="font-semibold">Rs {purchase.product?.totalIncome}</span></div>
                      <div>Validity: <span className="font-semibold">{purchase.product?.days} days</span></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Purchased on: {
                        (() => {
                          let dateVal = purchase.purchaseDate;
                          if (typeof dateVal === 'object' && dateVal !== null && dateVal.$date) dateVal = dateVal.$date;
                          if (dateVal && !isNaN(Date.parse(dateVal))) {
                            return new Date(dateVal).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
                          }
                          return '-';
                        })()
                      }
                    </div>
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer Nav */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
        <FooterItem icon={<FaHome />} label="Home" onClick={() => navigate('/home')} />
        <FooterItem icon={<FaCar />} label="Products" onClick={() => navigate('/products')} />
        <FooterItem icon={<FaUsers />} label="Team" onClick={() => navigate('/team')} />
        <FooterItem icon={<FaUser />} label="Profile" onClick={() => navigate('/profile')} />
      </footer>
    </div>
  );
};

const FooterItem = ({ icon, label, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center text-xs cursor-pointer text-gray-500 hover:text-yellow-500">
    <div className="text-xl">{icon}</div>
    <span>{label}</span>
  </div>
);

export default MyPurchase;
