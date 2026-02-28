import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminLogin from '../components/admin/AdminLogin';
import DashboardHome from '../components/admin/DashboardHome';
import ProductsManagement from '../components/admin/ProductsManagement';
import CustomersManagement from '../components/admin/CustomersManagement';
import OrdersManagement from '../components/admin/OrdersManagement';
import CustomerCarts from '../components/admin/CustomerCarts';
import SettingsManagement from '../components/admin/SettingsManagement';
import Analytics from '../components/admin/Analytics';
import PacksManagement from '../components/admin/PacksManagement'; // if you have it

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    setIsAuthenticated(false);
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <AdminSidebar onLogout={handleLogout} />
      <div className="flex-grow-1 p-4" style={{ background: '#f8f9fa' }}>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/products" element={<ProductsManagement />} />
          <Route path="/customers" element={<CustomersManagement />} />
          <Route path="/carts" element={<CustomerCarts />} />
          <Route path="/orders" element={<OrdersManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<SettingsManagement />} />
          <Route path="/packs" element={<PacksManagement />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  );
}