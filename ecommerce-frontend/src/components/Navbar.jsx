import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage(); // t is the translation function

  const cartItemsCount = cart.reduce((total, item) => total + (item.qty || 1), 0);
  const isAdmin = localStorage.getItem("admin_authenticated") === "true";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark px-3" style={{ backgroundColor: "#28a745" }}>
      <div className="container-fluid">
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img
            src="/trex-logo.png"
            alt="Logo"
            height="40"
            className="me-2"
          />
          <span className="fw-bold">TREX Shop</span>
        </Link>

        {/* Mobile toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links & controls */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2 align-items-center">
            <li className="nav-item">
              <Link to="/" className="nav-link btn-link">{t('home')}</Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className="nav-link btn-link">{t('products')}</Link>
            </li>
            <li className="nav-item">
              <Link to="/cart" className="nav-link btn-link position-relative">
                {t('cart')}
                {cartItemsCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link to="/admin" className="nav-link btn-link">{t('dashboard')}</Link>
              </li>
            )}

            {/* Theme toggle button */}
            <li className="nav-item">
              <button className="btn btn-outline-light me-2" onClick={toggleTheme}>
                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
              </button>
            </li>

            {/* Language dropdown */}
            <li className="nav-item">
              <select
                className="form-select form-select-sm bg-light text-dark"
                style={{ width: 'auto' }}
                value={lang}
                onChange={(e) => setLang(e.target.value)}
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="fr">Français</option>
              </select>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}