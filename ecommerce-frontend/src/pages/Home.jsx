import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [packs, setPacks] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, packsRes, settingsRes] = await Promise.all([
          api.get('/products'),
          api.get('/packs'),
          api.get('/settings'),
        ]);
        setProducts(productsRes.data);
        setPacks(packsRes.data);
        setSettings(settingsRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Combine products and packs (add isPack flag)
  const allItems = [
    ...products.map(p => ({ ...p, isPack: false })),
    ...packs.map(p => ({ ...p, isPack: true })),
  ];

  return (
    <>
      <section
        className="hero-section text-center text-white d-flex align-items-center justify-content-center mb-5"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop)",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
          borderRadius: '12px',
        }}
      >
        <div className="bg-dark bg-opacity-60 p-5 rounded">
          <h1 className="fw-bold display-5">{settings.siteName || 'Welcome to TREX Shop'}</h1>
          <p className="lead fs-4">Find the best products at the best prices</p>
          <a href="#products" className="btn btn-success btn-lg mt-3">
            Shop Now
          </a>
        </div>
      </section>

      <section id="products">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Featured Items</h2>
          <span className="badge bg-success fs-6">
            {allItems.length} {allItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading items...</p>
          </div>
        ) : allItems.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted fs-5">No items available.</p>
          </div>
        ) : (
          <div className="row g-4">
            {allItems.map((item) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={item.id}>
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="contact-section my-5 p-5 bg-light rounded">
        <h2 className="mb-4 text-center">Contact Us</h2>
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <p className="fs-5">
              📧 Email: {settings.email || 'support@trexshop.com'} <br />
              📞 Phone: {settings.phone || '+213 555 123 456'} <br />
              📍 Address: {settings.address || 'Algiers, Algeria'}
            </p>
            <div className="mt-4">
              <h5>Store Hours</h5>
              <p className="mb-1">Monday - Friday: 9:00 AM - 8:00 PM</p>
              <p className="mb-1">Saturday: 10:00 AM - 6:00 PM</p>
              <p>Sunday: 12:00 PM - 5:00 PM</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}