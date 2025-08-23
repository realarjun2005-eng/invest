import { useState } from 'react';

export default function AddProduct() {
  const [product, setProduct] = useState({
    title: '',
    description: '',
    image: '',
    price: '',
    category: '',
    offer: '',
    dailyIncome: '',
    totalIncome: '',
    days: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    // Convert number fields
    const payload = {
      ...product,
      price: product.price ? Number(product.price) : undefined,
      dailyIncome: product.dailyIncome ? Number(product.dailyIncome) : undefined,
      totalIncome: product.totalIncome ? Number(product.totalIncome) : undefined,
      days: product.days ? Number(product.days) : undefined
    };
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      const res = await fetch('https://invest-2-9yoa.onrender.com/api/admin/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Product Added!');
        setProduct({
          title: '', description: '', image: '', price: '', category: '', offer: '', dailyIncome: '', totalIncome: '', days: ''
        });
      } else {
        setMessage(data.message || 'Error adding product');
      }
    } catch (err) {
      setMessage('Error adding product');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add New Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" value={product.title} placeholder="Title*" className="input" onChange={handleChange} required />
            <input name="price" type="number" value={product.price} placeholder="Price*" className="input" onChange={handleChange} required />
            <input name="image" value={product.image} placeholder="Image URL" className="input md:col-span-2" onChange={handleChange} />
            <input name="category" value={product.category} placeholder="Category" className="input" onChange={handleChange} />
            <input name="offer" value={product.offer} placeholder="Offer" className="input" onChange={handleChange} />
            <input name="dailyIncome" type="number" value={product.dailyIncome} placeholder="Daily Income" className="input" onChange={handleChange} />
            <input name="totalIncome" type="number" value={product.totalIncome} placeholder="Total Income" className="input" onChange={handleChange} />
            <input name="days" type="number" value={product.days} placeholder="Days" className="input" onChange={handleChange} />
          </div>
          <textarea name="description" value={product.description} placeholder="Description" className="input h-20 resize-none" onChange={handleChange} />
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold py-2 rounded-lg shadow transition-all duration-200">Add Product</button>
          {message && (
            <div className={`mt-2 text-center text-sm ${message.includes('Added') ? 'text-green-600' : 'text-red-500'}`}>{message}</div>
          )}
        </form>
      </div>
      <style>{`
        .input {
          @apply border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150 w-full;
        }
      `}</style>
    </div>
  );
}
