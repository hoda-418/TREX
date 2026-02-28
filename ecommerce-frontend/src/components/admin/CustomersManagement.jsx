import { useState, useEffect } from 'react';
import api from '../../api';

export default function CustomersManagement() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // Customers are derived from orders; we'll fetch orders and aggregate
      const ordersRes = await api.get('/orders');
      const orders = ordersRes.data;

      // Aggregate customers from orders
      const customerMap = new Map();
      orders.forEach(order => {
        if (order.customer && order.customer.phone) {
          const key = order.customer.phone;
          if (!customerMap.has(key)) {
            customerMap.set(key, {
              id: key,
              firstName: order.customer.firstName,
              lastName: order.customer.lastName,
              email: order.customer.email || '',
              phone: order.customer.phone,
              address: order.customer.address,
              orders: 1,
              totalSpent: order.total || 0,
              firstOrder: order.date,
              lastOrder: order.date,
              orderIds: [order._id]
            });
          } else {
            const existing = customerMap.get(key);
            existing.orders += 1;
            existing.totalSpent += order.total || 0;
            existing.lastOrder = order.date;
            existing.orderIds.push(order._id);
          }
        }
      });
      setCustomers(Array.from(customerMap.values()));
    } catch (err) {
      console.error('Failed to fetch customers', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    customer.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    customer.phone?.includes(search) ||
    customer.email?.toLowerCase().includes(search.toLowerCase())
  );

  const deleteCustomer = async (customerId) => {
    if (window.confirm('Delete this customer and all their orders?')) {
      // Find all order IDs for this customer
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        for (const orderId of customer.orderIds) {
          await api.delete(`/orders/${orderId}`);
        }
        fetchCustomers(); // refresh list
        setSelectedCustomer(null);
      }
    }
  };

  const deleteAllCustomers = async () => {
    if (window.confirm('⚠️ Delete ALL customers and their orders?')) {
      const ordersRes = await api.get('/orders');
      for (const order of ordersRes.data) {
        await api.delete(`/orders/${order._id}`);
      }
      fetchCustomers();
    }
  };

  const calculateStats = () => {
    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
    const totalOrders = customers.reduce((sum, c) => sum + (c.orders || 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    return { totalCustomers, totalRevenue, totalOrders, avgOrderValue };
  };

  const stats = calculateStats();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Customers Management</h2>
        <button className="btn btn-danger" onClick={deleteAllCustomers}>Delete All Customers</button>
      </div>

      <div className="row mb-4">
        <div className="col-md-3"><div className="card"><div className="card-body"><h6>Total Customers</h6><h2>{stats.totalCustomers}</h2></div></div></div>
        <div className="col-md-3"><div className="card"><div className="card-body"><h6>Total Orders</h6><h2>{stats.totalOrders}</h2></div></div></div>
        <div className="col-md-3"><div className="card"><div className="card-body"><h6>Total Revenue</h6><h2>${stats.totalRevenue.toFixed(2)}</h2></div></div></div>
        <div className="col-md-3"><div className="card"><div className="card-body"><h6>Avg. Order Value</h6><h2>${stats.avgOrderValue.toFixed(2)}</h2></div></div></div>
      </div>

      <div className="mb-4">
        <input type="text" className="form-control" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">Customers ({filteredCustomers.length})</div>
            <div className="list-group list-group-flush">
              {filteredCustomers.map(customer => (
                <button key={customer.id} className={`list-group-item list-group-item-action ${selectedCustomer?.id === customer.id ? 'active' : ''}`} onClick={() => setSelectedCustomer(customer)}>
                  {customer.firstName} {customer.lastName}<br /><small>{customer.phone}</small>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between">
              <span>Customer Details</span>
              {selectedCustomer && <button className="btn btn-sm btn-danger" onClick={() => deleteCustomer(selectedCustomer.id)}>Delete</button>}
            </div>
            <div className="card-body">
              {selectedCustomer ? (
                <>
                  <p><strong>Name:</strong> {selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                  <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                  <p><strong>Email:</strong> {selectedCustomer.email || 'N/A'}</p>
                  <p><strong>Address:</strong> {selectedCustomer.address}</p>
                  <p><strong>Total Orders:</strong> {selectedCustomer.orders}</p>
                  <p><strong>Total Spent:</strong> ${selectedCustomer.totalSpent.toFixed(2)}</p>
                  <p><strong>First Order:</strong> {new Date(selectedCustomer.firstOrder).toLocaleDateString()}</p>
                  <p><strong>Last Order:</strong> {new Date(selectedCustomer.lastOrder).toLocaleDateString()}</p>
                </>
              ) : (
                <p className="text-muted">Select a customer</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}