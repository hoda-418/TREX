import { useState, useEffect } from 'react';
import api from '../../api';

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    approvedOrders: 0,
    topProducts: [],
    monthlyStats: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics');
      setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    }
  };

  const exportAnalytics = () => {
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Analytics</h2>
        <button className="btn btn-success" onClick={exportAnalytics}>Export</button>
      </div>

      <div className="row mb-4">
        <div className="col-md-3"><div className="card"><div className="card-body"><h6>Total Revenue</h6><h3>{formatCurrency(analytics.totalRevenue)}</h3></div></div></div>
        <div className="col-md-3"><div className="card"><div className="card-body"><h6>Total Orders</h6><h3>{analytics.totalOrders}</h3></div></div></div>
        <div className="col-md-3"><div className="card"><div className="card-body"><h6>Pending Orders</h6><h3>{analytics.pendingOrders}</h3></div></div></div>
        <div className="col-md-3"><div className="card"><div className="card-body"><h6>Approved Orders</h6><h3>{analytics.approvedOrders}</h3></div></div></div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">Top Products</div>
            <div className="card-body">
              {analytics.topProducts.length ? (
                <table className="table">
                  <thead><tr><th>Product</th><th>Quantity</th><th>Revenue</th></tr></thead>
                  <tbody>
                    {analytics.topProducts.map((p, i) => (
                      <tr key={i}><td>{p.title}</td><td>{p.quantity}</td><td>{formatCurrency(p.revenue)}</td></tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="text-muted">No data</p>}
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">Monthly Stats</div>
            <div className="card-body">
              {analytics.monthlyStats.length ? (
                <table className="table">
                  <thead><tr><th>Month</th><th>Orders</th><th>Revenue</th><th>Customers</th></tr></thead>
                  <tbody>
                    {analytics.monthlyStats.map((m, i) => (
                      <tr key={i}><td>{m.month}</td><td>{m.orders}</td><td>{formatCurrency(m.revenue)}</td><td>{m.customers}</td></tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="text-muted">No data</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}