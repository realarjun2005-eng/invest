// client/src/App.jsx
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Welcome from './components/Welcome';
import AccountDetails from "./pages/AccountDetails";
import AdminDashboardLayout from './pages/AdminDashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import MyPurchase from './pages/MyPurchase';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Team from './pages/Team';



import Checkin from "./pages/Checkin";
import HelpCenter from "./pages/HelpCenter";
import Invite from "./pages/Invite";
import Recharge from "./pages/Recharge";
import WithdrawRecord from "./pages/WithdrawRecord";

import About from './pages/about';
import IncomeRecord from './pages/IncomeRecord';
import Notifications from './pages/Notifications';



// Inside <Routes>



const App = () => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {}
  // Helper for protected routes
  const PrivateRoute = ({ element }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.token ? element : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<PrivateRoute element={<Home/>} />} />
        <Route path="/products" element={<PrivateRoute element={<Products />} />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="/team" element={<PrivateRoute element={<Team/>} />} />
        <Route path="/purchase" element={<PrivateRoute element={<MyPurchase />} />} />
        <Route path="/account-details" element={<PrivateRoute element={<AccountDetails />} />} />
        <Route path="/withdraw" element={<PrivateRoute element={<WithdrawRecord />} />} />
        <Route path="/help-center" element={<PrivateRoute element={<HelpCenter />} />} />
        <Route path="/recharge" element={<PrivateRoute element={<Recharge />} />} />
        <Route path="/checkin" element={<PrivateRoute element={<Checkin />} />} />
        <Route path="/invite" element={<PrivateRoute element={<Invite />} />} />
        <Route path="/about" element={<PrivateRoute element={<About />} />} />
        <Route path="/income-record" element={<PrivateRoute element={<IncomeRecord />} />} />
        <Route path="/admin/*" element={user?.role === 'admin' ? <AdminDashboardLayout /> : <Navigate to="/" />} />
        <Route path="/notifications" element={<PrivateRoute element={<Notifications />} />} />
      </Routes>
    </Router>
  );
};

export default App;
