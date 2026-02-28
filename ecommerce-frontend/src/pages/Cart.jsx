import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../api';

export default function Cart() {
  const { cart, addToCart, decrementQty, removeFromCart, total, clearCart } = useCart();
  const [shippingFee] = useState(5);
  const [orderInfo, setOrderInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    email: ''
  });

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!orderInfo.firstName || !orderInfo.lastName || !orderInfo.phone || !orderInfo.address) {
      alert('Please fill all required fields');
      return;
    }

    const orderData = {
      customer: orderInfo,
      items: cart.map(item => ({
        productId: item._id || item.id,
        title: item.title,
        price: item.price,
        qty: item.qty,
        image: item.image
      })),
      subtotal: total,
      shipping: shippingFee,
      total: total + shippingFee
    };

    try {
      await api.post('/orders', orderData);
      alert('✅ Order placed successfully!');
      clearCart();
      setOrderInfo({ firstName: '', lastName: '', phone: '', address: '', email: '' });
    } catch (err) {
      console.error('Order failed', err);
      alert('Order failed. Please try again.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="fs-5 mb-3">Your cart is empty.</p>
        <Link to="/" className="btn btn-success btn-lg">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-4">Your Shopping Cart</h2>
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}></th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id || item._id} className="align-middle">
                    <td>
                      <img src={item.image} alt={item.title} className="rounded" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                    </td>
                    <td>
                      <div className="fw-semibold">{item.title}</div>
                      <small className="text-muted">{item.category}</small>
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => decrementQty(item.id)}>−</button>
                        <span className="px-2">{item.qty}</span>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => addToCart(item)}>+</button>
                      </div>
                    </td>
                    <td className="fw-bold">${(item.price * item.qty).toFixed(2)}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer bg-white border-0">
          <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-outline-danger" onClick={clearCart}>Clear Cart</button>
            <div className="text-end">
              <h5 className="mb-2">Subtotal: <span className="text-success">${total.toFixed(2)}</span></h5>
              <h6 className="text-muted mb-0">Shipping: ${shippingFee.toFixed(2)}</h6>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h4 className="mb-4">Shipping Information</h4>
              <form onSubmit={handleOrder}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name *</label>
                    <input type="text" className="form-control" value={orderInfo.firstName} onChange={(e) => setOrderInfo({ ...orderInfo, firstName: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name *</label>
                    <input type="text" className="form-control" value={orderInfo.lastName} onChange={(e) => setOrderInfo({ ...orderInfo, lastName: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number *</label>
                    <input type="tel" className="form-control" value={orderInfo.phone} onChange={(e) => setOrderInfo({ ...orderInfo, phone: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" value={orderInfo.email} onChange={(e) => setOrderInfo({ ...orderInfo, email: e.target.value })} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Shipping Address *</label>
                    <textarea className="form-control" rows="3" value={orderInfo.address} onChange={(e) => setOrderInfo({ ...orderInfo, address: e.target.value })} required />
                  </div>
                </div>
                <div className="mt-4">
                  <button type="submit" className="btn btn-success btn-lg w-100">Place Order - ${(total + shippingFee).toFixed(2)}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-body">
              <h4 className="mb-4">Order Summary</h4>
              <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
              <div className="d-flex justify-content-between mb-2"><span>Shipping</span><span>${shippingFee.toFixed(2)}</span></div>
              <hr />
              <div className="d-flex justify-content-between mb-4"><strong>Total</strong><strong className="text-success">${(total + shippingFee).toFixed(2)}</strong></div>
              <Link to="/products" className="btn btn-outline-success w-100 mt-3">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}