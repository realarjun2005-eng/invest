import { useState } from 'react';

export default function AdminOfferProduct() {
  const [form, setForm] = useState({
    title: 'Special Plan',
    description: 'Special offer plan',
    image: 'https://via.placeholder.com/150x90?text=OLA+Car',
    price: 600,
    category: 'Special',
    offer: 'Special',
    dailyIncome: 1900,
    totalIncome: 1900,
    days: 1,
    planType: 'daily'
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      if (!token) {
        setMessage('Not authenticated');
        return;
      }
      const res = await fetch('https://invest-2-9yoa.onrender.com/api/admin/offer-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          dailyIncome: Number(form.dailyIncome),
          totalIncome: Number(form.totalIncome),
          days: Number(form.days),
          planType: form.planType
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Success');
      } else {
        setMessage(data.message || 'Error');
      }
    } catch (err) {
      setMessage('Error submitting form');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Create/Update Offer Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="planType" value={form.planType} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="daily">Daily Plan</option>
          <option value="quick">Quick Plan</option>
        </select>
        <input name="title" value={form.title} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Title" />
        <input name="description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Description" />
        <input name="image" value={form.image} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Image URL" />
        <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Price" />
        <input name="category" value={form.category} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Category" />
        <input name="offer" value={form.offer} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Offer" />
        <input name="dailyIncome" type="number" value={form.dailyIncome} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Daily Income" />
        <input name="totalIncome" type="number" value={form.totalIncome} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Total Income" />
        <input name="days" type="number" value={form.days} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Days" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
      {message && <div className="mt-4 text-center text-sm text-green-600">{message}</div>}
    </div>
  );
}
