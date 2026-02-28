import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import api from './../api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [form, setForm] = useState({ user: '', rating: 5, comment: '' });
  const [orderForm, setOrderForm] = useState({ firstName: '', lastName: '', phone: '', address: '', email: '' });
  const { addToCart } = useCart();
  const shippingFee = 5;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        setFeedbacks(res.data.feedbacks || []);
      } catch (err) {
        console.error('Failed to fetch product', err);
      }
    };
    fetchProduct();
  }, [id]);

  const submitFeedback = async (e) => {
    e.preventDefault();
    if (!form.user || !form.comment) return;

    const newFeedback = { ...form, rating: Number(form.rating) };
    try {
      const updatedFeedbacks = [...feedbacks, newFeedback];
      // Update product with new feedback
      await api.put(`/products/${id}`, { ...product, feedbacks: updatedFeedbacks });
      setFeedbacks(updatedFeedbacks);
      setForm({ user: '', rating: 5, comment: '' });
    } catch (err) {
      console.error('Failed to submit feedback', err);
    }
  };

  const handleOrder = (e) => {
    e.preventDefault();
    if (!orderForm.firstName || !orderForm.lastName || !orderForm.phone || !orderForm.address) {
      alert('Please fill all fields');
      return;
    }
    addToCart({ ...product, qty: 1 });
    // Optionally save order directly? But cart handles it.
    alert('Product added to cart!');
    setOrderForm({ firstName: '', lastName: '', phone: '', address: '', email: '' });
  };

  if (!product) return <h3 className="text-center mt-5">Loading...</h3>;

  const totalWithShipping = product.price + shippingFee;

  return (
    <div className="row g-4">
      {/* images, details, feedback form – similar to before */}
      <div className="col-md-6">
        {product.images && product.images.length > 0 ? (
          <div id="carouselImages" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {product.images.map((img, index) => (
                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  <img src={img} className="d-block w-100 rounded" alt={product.title} />
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselImages" data-bs-slide="prev">
              <span className="carousel-control-prev-icon"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselImages" data-bs-slide="next">
              <span className="carousel-control-next-icon"></span>
            </button>
          </div>
        ) : (
          <img src={product.image} className="img-fluid rounded" alt={product.title} />
        )}
      </div>

      <div className="col-md-6">
        <h2>{product.title}</h2>
        <p className="text-muted">{product.category}</p>
        <p>{product.description}</p>
        {product.discount > 0 ? (
          <div>
            <h4 className="text-muted text-decoration-line-through">${product.price}</h4>
            <h2 className="text-success">${(product.price * (1 - product.discount / 100)).toFixed(2)}</h2>
            <span className="badge bg-danger">-{product.discount}%</span>
          </div>
        ) : (
          <h2 className="text-success">${product.price}</h2>
        )}
        <button className="btn btn-success mb-3" onClick={() => addToCart(product)}>
          Add to Cart
        </button>

        <div className="card p-3">
          <h5>Order this product directly</h5>
          <form onSubmit={handleOrder} className="mt-2">
            <input className="form-control mb-2" placeholder="First Name" value={orderForm.firstName} onChange={(e) => setOrderForm({ ...orderForm, firstName: e.target.value })} />
            <input className="form-control mb-2" placeholder="Last Name" value={orderForm.lastName} onChange={(e) => setOrderForm({ ...orderForm, lastName: e.target.value })} />
            <input className="form-control mb-2" placeholder="Phone" value={orderForm.phone} onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })} />
            <input className="form-control mb-2" placeholder="Address" value={orderForm.address} onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })} />
            <p className="fw-semibold">
              Price: ${product.price} + Shipping: ${shippingFee} = <span className="text-success">${totalWithShipping}</span>
            </p>
            <button type="submit" className="btn btn-primary w-100">Order Now</button>
          </form>
        </div>
      </div>

      <div className="col-12">
        <hr />
        <h4 className="mb-3">Feedbacks</h4>
        {feedbacks.length === 0 && <p className="text-muted">No feedbacks yet.</p>}
        {feedbacks.map((f, i) => (
          <div key={i} className="border rounded p-3 mb-2">
            <strong>{f.user}</strong> — <span>{f.rating}/5</span>
            <p className="mb-0">{f.comment}</p>
          </div>
        ))}

        <form className="mt-3" onSubmit={submitFeedback}>
          <div className="row g-2">
            <div className="col-sm-4">
              <input className="form-control" placeholder="Your name" value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })} />
            </div>
            <div className="col-sm-2">
              <select className="form-select" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="col-sm-6">
              <input className="form-control" placeholder="Write a comment" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary mt-2">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
}