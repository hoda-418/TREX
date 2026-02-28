import { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import api from '../../api';

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: '',
    description: '',
    category: '',
    price: '',
    discount: 0,
    images: []
  });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) {
      alert('Please fill in title and price');
      return;
    }

    const productData = {
      title: form.title,
      description: form.description,
      category: form.category,
      price: parseFloat(form.price),
      discount: form.discount || 0,
      image: form.images[0] || '',
      images: form.images,
      feedbacks: []
    };

    try {
      if (form.id) {
        // Update
        await api.put(`/products/${form.id}`, productData);
        alert('Product updated successfully!');
      } else {
        // Create
        await api.post('/products', productData);
        alert('Product added successfully!');
      }
      fetchProducts();
      resetForm();
    } catch (err) {
      console.error('Failed to save product', err);
      alert('Error saving product');
    }
  };

  const editProduct = (product) => {
    setForm({
      id: product._id,
      title: product.title,
      description: product.description || '',
      category: product.category || '',
      price: product.price,
      discount: product.discount || 0,
      images: product.images || []
    });
    window.scrollTo(0, 0);
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        alert('Product deleted successfully!');
        fetchProducts();
      } catch (err) {
        console.error('Failed to delete product', err);
      }
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      title: '',
      description: '',
      category: '',
      price: '',
      discount: 0,
      images: []
    });
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
                         p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="fw-bold mb-4">Products Management</h2>
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">{form.id ? `Edit Product #${form.id}` : 'Add New Product'}</h5>
          <ProductForm form={form} setForm={setForm} saveProduct={saveProduct} resetForm={resetForm} />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="col-md-6">
          <select className="form-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
          </select>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Products List ({filteredProducts.length})</h5>
          {filteredProducts.length === 0 ? (
            <p className="text-muted">No products found.</p>
          ) : (
            <ProductList products={filteredProducts} editProduct={editProduct} deleteProduct={deleteProduct} deleteFeedback={() => {}} />
          )}
        </div>
      </div>
    </div>
  );
}