export default function OrdersList({ orders, updateOrderStatus }) {
  if (orders.length === 0) return <p>No orders yet.</p>;

  return (
    <>
      {orders.map((order) => (
        <div key={order.id} className="card mb-3">
          <div className="card-body">
            <h6>Order #{order.id}</h6>
            <p>👤 {order.customer?.firstName} {order.customer?.lastName}</p>
            <p>📞 {order.customer?.phone}</p>
            <p>🏠 {order.customer?.address}</p>
            <ul>
              {order.items.map((it) => (
                <li key={it.id}>
                  {it.title} — ${it.price} × {it.qty}
                </li>
              ))}
            </ul>
            <p>Subtotal: <strong>${order.subtotal.toFixed(2)}</strong></p>
            <p>Shipping: <strong>${order.shipping.toFixed(2)}</strong></p>
            <p>Total: <strong>${order.total.toFixed(2)}</strong></p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  order.status === "accepted"
                    ? "text-success"
                    : order.status === "refused"
                    ? "text-danger"
                    : "text-secondary"
                }
              >
                {order.status}
              </span>
            </p>
            {order.status === "pending" && (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => updateOrderStatus(order.id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => updateOrderStatus(order.id, "refused")}
                >
                  Refuse
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
