import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";

export default function OrdersManagement() {
  const { orders, updateOrderStatus } = useCart();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeCallMenu, setActiveCallMenu] = useState(null);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, searchTerm]);

  const filterOrders = () => {
    let filtered = [...orders];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.phone?.includes(searchTerm) ||
        order.id.toString().includes(searchTerm)
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredOrders(filtered);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending": return "bg-light text-dark border";
      case "call1_answered": return "bg-success";
      case "call1_not_answered": return "bg-danger";
      case "call2_answered": return "bg-success";
      case "call2_not_answered": return "bg-danger";
      case "approved": return "bg-success";
      case "disapproved": return "bg-danger";
      default: return "bg-light text-dark border";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending": return "⏳ New Order";
      case "call1_answered": return "📞 Call 1 - ✅";
      case "call1_not_answered": return "📞 Call 1 - ❌";
      case "call2_answered": return "📞 Call 2 - ✅";
      case "call2_not_answered": return "📞 Call 2 - ❌";
      case "approved": return "✅ Approved";
      case "disapproved": return "❌ Disapproved";
      default: return status;
    }
  };

  const calculateOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === "pending").length;
    const call1_answered = orders.filter(o => o.status === "call1_answered").length;
    const call1_not_answered = orders.filter(o => o.status === "call1_not_answered").length;
    const call2_answered = orders.filter(o => o.status === "call2_answered").length;
    const call2_not_answered = orders.filter(o => o.status === "call2_not_answered").length;
    const approved = orders.filter(o => o.status === "approved").length;
    const disapproved = orders.filter(o => o.status === "disapproved").length;
    
    const totalRevenue = orders
      .filter(o => o.status === "approved")
      .reduce((sum, o) => sum + (o.total || 0), 0);
    
    return { 
      total, pending, 
      call1_answered, call1_not_answered,
      call2_answered, call2_not_answered,
      approved, disapproved, 
      totalRevenue 
    };
  };

  const stats = calculateOrderStats();

  const deleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      const updatedOrders = orders.filter(o => o.id !== orderId);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      window.dispatchEvent(new Event("storage"));
      setSelectedOrder(null);
      alert("Order deleted successfully!");
    }
  };

  const deleteAllOrders = () => {
    if (window.confirm("⚠️ DANGER: This will delete ALL orders! Are you absolutely sure?")) {
      localStorage.removeItem("orders");
      window.dispatchEvent(new Event("storage"));
      setSelectedOrder(null);
      alert("All orders deleted successfully!");
    }
  };

  const handleCall1Action = (orderId, answered) => {
    const status = answered ? "call1_answered" : "call1_not_answered";
    updateOrderStatus(orderId, status);
    setActiveCallMenu(null);
  };

  const handleCall2Action = (orderId, answered) => {
    const status = answered ? "call2_answered" : "call2_not_answered";
    updateOrderStatus(orderId, status);
    setActiveCallMenu(null);
  };

  const handleFinalDecision = (orderId, approved) => {
    const status = approved ? "approved" : "disapproved";
    updateOrderStatus(orderId, status);
  };

  const toggleCallMenu = (orderId, callType) => {
    if (activeCallMenu === `${orderId}_${callType}`) {
      setActiveCallMenu(null);
    } else {
      setActiveCallMenu(`${orderId}_${callType}`);
    }
  };

  const getProductSummary = (items) => {
    if (!items || items.length === 0) return "No items";
    const firstItem = items[0];
    const totalItems = items.reduce((sum, item) => sum + (item.qty || 1), 0);
    return `${firstItem.title} ${items.length > 1 ? `+${items.length - 1} more` : ''} (${totalItems} items)`;
  };

  const getProductPrice = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  };

  const getOrderNumber = (orderId) => {
    return `ORD${orderId.toString().slice(-6)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusDisplay = (order) => {
    const status = order.status;
    const isActive = activeCallMenu === `${order.id}_status`;
    
    return (
      <div className="position-relative">
        <span className={`badge ${getStatusBadgeClass(status)}`}>
          {getStatusText(status)}
        </span>
      </div>
    );
  };

  const getActionButtons = (order) => {
    const { id, status } = order;
    const isCall1Active = activeCallMenu === `${id}_call1`;
    const isCall2Active = activeCallMenu === `${id}_call2`;
    const isDecisionActive = activeCallMenu === `${id}_decision`;

    switch (status) {
      case "pending":
        return (
          <div className="d-flex flex-column gap-1">
            <button
              className={`btn btn-sm ${isCall1Active ? 'btn-primary' : 'btn-outline-primary border-2'}`}
              onClick={() => toggleCallMenu(id, 'call1')}
            >
              📞 Call 1
            </button>
            {isCall1Active && (
              <div className="d-flex gap-1 mt-1">
                <button
                  className="btn btn-sm btn-success flex-fill"
                  onClick={() => handleCall1Action(id, true)}
                >
                  ✅
                </button>
                <button
                  className="btn btn-sm btn-danger flex-fill"
                  onClick={() => handleCall1Action(id, false)}
                >
                  ❌
                </button>
              </div>
            )}
          </div>
        );

      case "call1_answered":
      case "call1_not_answered":
        return (
          <div className="d-flex flex-column gap-1">
            <button
              className={`btn btn-sm ${isCall2Active ? 'btn-primary' : 'btn-outline-primary border-2'}`}
              onClick={() => toggleCallMenu(id, 'call2')}
            >
              📞 Call 2
            </button>
            {isCall2Active && (
              <div className="d-flex gap-1 mt-1">
                <button
                  className="btn btn-sm btn-success flex-fill"
                  onClick={() => handleCall2Action(id, true)}
                >
                  ✅
                </button>
                <button
                  className="btn btn-sm btn-danger flex-fill"
                  onClick={() => handleCall2Action(id, false)}
                >
                  ❌
                </button>
              </div>
            )}
          </div>
        );

      case "call2_answered":
      case "call2_not_answered":
        return (
          <div className="d-flex flex-column gap-1">
            <button
              className={`btn btn-sm ${isDecisionActive ? 'btn-primary' : 'btn-outline-primary border-2'}`}
              onClick={() => toggleCallMenu(id, 'decision')}
            >
              ⚖️ Decision
            </button>
            {isDecisionActive && (
              <div className="d-flex flex-column gap-1 mt-1">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleFinalDecision(id, true)}
                >
                  ✅ Approve
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleFinalDecision(id, false)}
                >
                  ❌ Disapprove
                </button>
              </div>
            )}
          </div>
        );

      case "approved":
        return (
          <div className="d-flex flex-column gap-1">
            <button
              className="btn btn-sm btn-success w-100"
              disabled
            >
              ✅ Approved
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => deleteOrder(id)}
            >
              Delete
            </button>
          </div>
        );

      case "disapproved":
        return (
          <div className="d-flex flex-column gap-1">
            <button
              className="btn btn-sm btn-danger w-100"
              onClick={() => deleteOrder(id)}
            >
              ❌ Delete Order
            </button>
          </div>
        );

      default:
        return (
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => deleteOrder(id)}
          >
            Delete
          </button>
        );
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Orders Management</h2>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary" 
            onClick={() => window.dispatchEvent(new Event("storage"))}
          >
            🔄 Refresh
          </button>
          <button 
            className="btn btn-danger" 
            onClick={deleteAllOrders}
          >
            🗑️ Delete All Orders
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <h6 className="text-muted mb-2">Total Orders</h6>
              <h3 className="fw-bold">{stats.total}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <h6 className="text-muted mb-2">✅ Approved</h6>
              <h3 className="fw-bold text-success">{stats.approved}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <h6 className="text-muted mb-2">⏳ Pending</h6>
              <h3 className="fw-bold text-warning">{stats.pending}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <h6 className="text-muted mb-2">💰 Revenue</h6>
              <h3 className="fw-bold text-success">${stats.totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="input-group">
            <span className="input-group-text bg-white">
              🔍
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, phone, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">⏳ New Orders</option>
            <option value="call1_answered">📞 Call 1 - Answered</option>
            <option value="call1_not_answered">📞 Call 1 - Not Answered</option>
            <option value="call2_answered">📞 Call 2 - Answered</option>
            <option value="call2_not_answered">📞 Call 2 - Not Answered</option>
            <option value="approved">✅ Approved</option>
            <option value="disapproved">❌ Disapproved</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0">
          <h5 className="mb-0">Orders List</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Product</th>
                  <th>Product Price</th>
                  <th>Shipping</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4">
                      <div className="text-muted">
                        <p className="mb-2">No orders found</p>
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setStatusFilter("all");
                            setSearchTerm("");
                          }}
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      className={selectedOrder?.id === order.id ? 'table-active' : ''}
                      onClick={() => setSelectedOrder(order)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div className="fw-semibold">{getOrderNumber(order.id)}</div>
                        <small className="text-muted">ID: {order.id}</small>
                      </td>
                      <td>
                        <small>{formatDate(order.date)}</small>
                      </td>
                      <td>
                        <div>
                          <div className="fw-semibold">
                            {order.customer?.firstName} {order.customer?.lastName}
                          </div>
                          <small className="text-muted">
                            {order.customer?.email || "No email"}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold">{order.customer?.phone}</div>
                      </td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '150px' }}>
                          {getProductSummary(order.items)}
                        </div>
                      </td>
                      <td className="fw-bold">
                        ${getProductPrice(order.items).toFixed(2)}
                      </td>
                      <td>
                        ${(order.shipping || 5).toFixed(2)}
                      </td>
                      <td className="fw-bold text-success">
                        ${order.total?.toFixed(2)}
                      </td>
                      <td>
                        {getStatusDisplay(order)}
                      </td>
                      <td style={{ minWidth: '120px' }}>
                        {getActionButtons(order)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer bg-white border-0">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
            <div>
              <button 
                className="btn btn-outline-primary" 
                onClick={() => {
                  // Export orders data
                  const dataStr = JSON.stringify(orders, null, 2);
                  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                  const exportFileDefaultName = `orders-${new Date().toISOString().split('T')[0]}.json`;
                  
                  const linkElement = document.createElement('a');
                  linkElement.setAttribute('href', dataUri);
                  linkElement.setAttribute('download', exportFileDefaultName);
                  linkElement.click();
                }}
              >
                📥 Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div 
          className="modal fade show" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => {
            if (e.target.className.includes('modal fade show')) {
              setSelectedOrder(null);
            }
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Order Details - {getOrderNumber(selectedOrder.id)}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="mb-3">Customer Information</h6>
                    <table className="table table-sm table-borderless">
                      <tbody>
                        <tr>
                          <td className="text-muted">Order #:</td>
                          <td className="fw-semibold">{getOrderNumber(selectedOrder.id)}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Order ID:</td>
                          <td>{selectedOrder.id}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Date:</td>
                          <td>{formatDate(selectedOrder.date)}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Name:</td>
                          <td>{selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Phone:</td>
                          <td>{selectedOrder.customer?.phone}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Email:</td>
                          <td>{selectedOrder.customer?.email || "Not provided"}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Address:</td>
                          <td>{selectedOrder.customer?.address}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h6 className="mb-3">Order Summary</h6>
                    <table className="table table-sm table-borderless">
                      <tbody>
                        <tr>
                          <td className="text-muted">Status:</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(selectedOrder.status)}`}>
                              {getStatusText(selectedOrder.status)}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">Product Price:</td>
                          <td>${getProductPrice(selectedOrder.items).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Shipping:</td>
                          <td>${(selectedOrder.shipping || 5).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Total:</td>
                          <td className="fw-bold text-success">
                            ${selectedOrder.total?.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-4">
                  <h6 className="mb-3">Order Items</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="d-flex align-items-center">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="rounded me-2"
                                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                  />
                                )}
                                <div>
                                  <div className="fw-semibold">{item.title}</div>
                                  <small className="text-muted">{item.category}</small>
                                </div>
                              </div>
                            </td>
                            <td>${item.price?.toFixed(2)}</td>
                            <td>{item.qty || 1}</td>
                            <td>${((item.price || 0) * (item.qty || 1)).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-4">
                  <h6 className="mb-3">Order Actions</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {getActionButtons(selectedOrder)}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}