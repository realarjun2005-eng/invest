import { Navigate, Route, Routes } from 'react-router-dom';

import AddProduct from './admin/AddProduct';
import AdminDashboard from './admin/AdminDashboard';
import ApproveWithdraw from './admin/ApproveWithdraw';
import ViewUsers from './admin/ViewUsers';
import AdminOfferProduct from './AdminOfferProduct';
import AdminRechargeRequests from './AdminRechargeRequests';


const AdminDashboardLayout = () => (
  <Routes>
    <Route index element={<AdminDashboard />} />
    <Route path="users" element={<ViewUsers />} />
    <Route path="add-product" element={<AddProduct />} />
    <Route path="offer-product" element={<AdminOfferProduct />} />
    <Route path="withdraws" element={<ApproveWithdraw />} />
    <Route path="recharge-requests" element={<AdminRechargeRequests />} />
    <Route path="*" element={<Navigate to="/admin" />} />
  </Routes>
);

export default AdminDashboardLayout;
