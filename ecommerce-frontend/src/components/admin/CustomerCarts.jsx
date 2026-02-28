import { useState, useEffect } from 'react';
import api from '../../api';

export default function CustomerCarts() {
  const [carts, setCarts] = useState([]);
  const [selectedCart, setSelectedCart] = useState(null);

  useEffect(() => {
    fetchCarts();
    const interval = setInterval(fetchCarts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchCarts = async () => {
    try {
      const res = await api.get('/carts');
      setCarts(res.data);
    } catch (err) {
      console.error('Failed to fetch carts', err);
    }
  };

  const viewCartDetails = (cart) => setSelectedCart(cart);

  const clearCart = async (cartId) => {
    if (window.confirm('Clear this cart?')) {
      try {
        await api.delete(`/carts/${cartId}`);
        fetchCarts();
        setSelectedCart(null);
      } catch (err) {
        console.error('Failed to clear cart', err);
      }
    }
  };

  const clearAllCarts = async () => {
    if (window.confirm('Clear ALL carts?')) {
      for (const cart of carts) {
        await api.delete(`/carts/${cart._id}`);
      }
      fetchCarts();
    }
  };

  const sendReminder = (customerName, customerPhone) => {
    alert(`Reminder sent to ${customerName} (demo)`);
  };

  const stats = {
    totalCarts: carts.length,
    totalItems: carts.reduce((sum, c) => sum + (c.items?.length || 0), 0),
    totalValue: carts.reduce((sum, c) => sum + (c.total || 0), 0),
    avgCartValue: carts.length > 0 ? carts.reduce((sum, c) => sum + (c.total || 0), 0) / carts.length : 0
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Customer Carts</h2>
        <button className="btn btn-danger" onClick={clearAllCarts}>Clear All Carts</button>
      </div>

      <div className="row mb-4">
        <div className="col-md-3"><div className="card"><div className="card-body"><h6>Active Carts</h6><h2>{stats.totalCarts}</h2></div></div></div>
        <div className="col-md-3"><div className="card"><div className="card-body"><h6>Total Items</h6><h2>{stats.totalItems}</h2></div></div></div>
        <div className="col-md-3"><div className="card"><div className="card-body"><h6>Total Value</h6><h2>${stats.totalValue.toFixed(2)}</h2></div></div></div>
        <div className="col-md-3"><div className="card"><div className="card-body"><h6>Avg. Value</h6><h2>${stats.avgCartValue.toFixed(2)}</h2></div></div></div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">Carts</div>
            <div className="list-group list-group-flush">
              {carts.map(cart => (
                <button key={cart._id} className={`list-group-item list-group-item-action ${selectedCart?._id === cart._id ? 'active' : ''}`} onClick={() => viewCartDetails(cart)}>
                  {cart.customerName}<br /><small>{cart.items?.length} items – ${cart.total?.toFixed(2)}</small>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between">
              <span>{selectedCart ? `Cart: ${selectedCart.customerName}` : 'Select a Cart'}</span>
              {selectedCart && (
                <div>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => sendReminder(selectedCart.customerName, selectedCart.customerId)}>Remind</button>
                  <button className="btn btn-sm btn-danger" onClick={() => clearCart(selectedCart._id)}>Clear</button>
                </div>
              )}
            </div>
            <div className="card-body">
              {selectedCart ? (
                <table className="table">
                  <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th></tr></thead>
                  <tbody>
                    {selectedCart.items?.map((item, i) => (
                      <tr key={i}>
                        <td>{item.title}</td>
                        <td>${item.price}</td>
                        <td>{item.qty}</td>
                        <td>${(item.price * item.qty).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr><td colSpan="3" className="text-end fw-bold">Total:</td><td>${selectedCart.total?.toFixed(2)}</td></tr>
                  </tbody>
                </table>
              ) : (
                <p className="text-muted">Select a cart</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}