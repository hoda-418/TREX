import { NavLink } from "react-router-dom";

export default function AdminSidebar({ onLogout }) {
  const navItems = [
    { path: "/admin/packs", icon: "📦", label: "Packs" },
    { path: "/admin", icon: "📊", label: "Dashboard", exact: true },
    { path: "/admin/products", icon: "🛍️", label: "Products" },
    { path: "/admin/customers", icon: "👥", label: "Customers" },
    { path: "/admin/carts", icon: "🛒", label: "Customer Carts" },
    { path: "/admin/orders", icon: "📦", label: "Orders" },
    { path: "/admin/analytics", icon: "📈", label: "Analytics" },
    { path: "/admin/settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <div className="bg-dark text-white p-3" style={{ width: "250px", minHeight: "100vh" }}>
      <div className="d-flex align-items-center mb-4">
        <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "40px", height: "40px" }}>
          <span className="fw-bold">A</span>
        </div>
        <div>
          <h5 className="mb-0">Admin Panel</h5>
          <small className="text-muted">Owner Dashboard</small>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-muted small mb-2">MAIN NAVIGATION</div>
        <div className="list-group list-group-flush">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => 
                `list-group-item list-group-item-action bg-transparent text-white border-0 mb-1 rounded ${isActive ? 'bg-success' : 'hover-bg-secondary'}`
              }
            >
              <span className="me-2">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-5">
        <button
          onClick={onLogout}
          className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
        >
          <span className="me-2">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}