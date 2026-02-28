import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [packs, setPacks] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [productsRes, packsRes] = await Promise.all([
          api.get('/products'),
          api.get('/packs'),
        ]);
        setProducts(productsRes.data);
        setPacks(packsRes.data);
      } catch (err) {
        console.error('Failed to fetch items', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const allItems = [
    ...products.map(p => ({ ...p, isPack: false })),
    ...packs.map(p => ({ ...p, isPack: true })),
  ];

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase()) ||
                         item.description?.toLowerCase().includes(search.toLowerCase()) ||
                         item.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(allItems.map(item => item.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading items...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="input-group">
            <span className="input-group-text bg-success text-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, description, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="input-group">
            <span className="input-group-text bg-success text-white">
              <i className="bi bi-filter"></i>
            </span>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Items</h2>
        <span className="badge bg-success fs-6">
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
        </span>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted fs-5 mb-3">No items found matching your criteria.</p>
          {search && (
            <button className="btn btn-outline-success me-2" onClick={() => setSearch('')}>
              Clear Search
            </button>
          )}
          {category !== 'all' && (
            <button className="btn btn-outline-success" onClick={() => setCategory('all')}>
              Clear Filter
            </button>
          )}
          <div className="mt-4">
            <Link to="/" className="btn btn-success">
              Return to Home
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {filteredItems.map((item) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={item.id}>
                <ProductCard product={item} />
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link to="/" className="btn btn-outline-success">
              <i className="bi bi-arrow-left me-2"></i>
              Back to Home
            </Link>
          </div>
        </>
      )}
    </div>
  );
}