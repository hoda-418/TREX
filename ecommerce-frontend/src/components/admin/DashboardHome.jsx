import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    activeCarts: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    loadRecentData();
  }, []);

  const loadStats = () => {
    const products = JSON.parse(localStorage.getItem("admin_products") || "[]");
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const customers = JSON.parse(localStorage.getItem("customers") || "[]");
    const carts = JSON.parse(localStorage.getItem("customer_carts") || "[]");

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = orders.filter(order => order.status === "pending").length;

    setStats({
      totalProducts: products.length,
      totalCustomers: customers.length,
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      activeCarts: carts.length
    });
  };

  const loadRecentData = () => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const customers = JSON.parse(localStorage.getItem("customers") || "[]");

    setRecentOrders(orders.slice(0, 5));
    setRecentCustomers(customers.slice(0, 5));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Dashboard Overview</h2>
        <div className="text-muted">
          Welcome back, <strong>{localStorage.getItem("admin_username") || "Admin"}</strong>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Total Products</h6>
                  <h3 className="fw-bold">{stats.totalProducts}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <span className="text-success fs-4">🛍️</span>
                </div>
              </div>
              <Link to="/admin/products" className="text-decoration-none small">
                View all products →
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Total Customers</h6>
                  <h3 className="fw-bold">{stats.totalCustomers}</h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <span className="text-info fs-4">👥</span>
                </div>
              </div>
              <Link to="/admin/customers" className="text-decoration-none small">
                View all customers →
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Total Revenue</h6>
                  <h3 className="fw-bold">${stats.totalRevenue.toFixed(2)}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <span className="text-warning fs-4">💰</span>
                </div>
              </div>
              <Link to="/admin/analytics" className="text-decoration-none small">
                View analytics →
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Total Orders</h6>
                  <h3 className="fw-bold">{stats.totalOrders}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <span className="text-primary fs-4">📦</span>
                </div>
              </div>
              <Link to="/admin/orders" className="text-decoration-none small">
                View all orders →
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Pending Orders</h6>
                  <h3 className="fw-bold">{stats.pendingOrders}</h3>
                </div>
                <div className="bg-danger bg-opacity-10 p-3 rounded">
                  <span className="text-danger fs-4">⏳</span>
                </div>
              </div>
              <Link to="/admin/orders?filter=pending" className="text-decoration-none small">
                View pending orders →
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Active Carts</h6>
                  <h3 className="fw-bold">{stats.activeCarts}</h3>
                </div>
                <div className="bg-secondary bg-opacity-10 p-3 rounded">
                  <span className="text-secondary fs-4">🛒</span>
                </div>
              </div>
              <Link to="/admin/carts" className="text-decoration-none small">
                View customer carts →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders and Customers */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Recent Orders</h5>
            </div>
            <div className="card-body">
              {recentOrders.length === 0 ? (
                <p className="text-muted">No orders yet.</p>
              ) : (
                <div className="list-group list-group-flush">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">Order #{order.id.toString().slice(-6)}</h6>
                          <small className="text-muted">
                            {order.customer?.firstName} {order.customer?.lastName}
                          </small>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold">${order.total?.toFixed(2)}</div>
                          <span className={`badge ${order.status === 'pending' ? 'bg-warning' : order.status === 'accepted' ? 'bg-success' : 'bg-danger'}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="card-footer bg-white border-0">
              <Link to="/admin/orders" className="btn btn-outline-success w-100">
                View All Orders
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Recent Customers</h5>
            </div>
            <div className="card-body">
              {recentCustomers.length === 0 ? (
                <p className="text-muted">No customers yet.</p>
              ) : (
                <div className="list-group list-group-flush">
                  {recentCustomers.map((customer) => (
                    <div key={customer.id} className="list-group-item border-0 px-0">
                      <div className="d-flex align-items-center">
                        <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "40px", height: "40px" }}>
                          <span className="text-success">{customer.firstName?.charAt(0)}</span>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{customer.firstName} {customer.lastName}</h6>
                          <small className="text-muted">{customer.email || customer.phone}</small>
                        </div>
                        <div className="text-end">
                          <span className="badge bg-secondary">
                            {customer.orders || 0} orders
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="card-footer bg-white border-0">
              <Link to="/admin/customers" className="btn btn-outline-success w-100">
                View All Customers
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0">
          <h5 className="mb-0">Quick Actions</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <Link to="/admin/products" className="btn btn-outline-success w-100">
                Add New Product
              </Link>
            </div>
            <div className="col-md-3">
              <Link to="/admin/orders?filter=pending" className="btn btn-outline-warning w-100">
                Process Orders
              </Link>
            </div>
            <div className="col-md-3">
              <Link to="/admin/analytics" className="btn btn-outline-info w-100">
                View Reports
              </Link>
            </div>
            <div className="col-md-3">
              <Link to="/admin/settings" className="btn btn-outline-secondary w-100">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}