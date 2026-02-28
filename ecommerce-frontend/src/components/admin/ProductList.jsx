export default function ProductList({ products, editProduct, deleteProduct, deleteFeedback }) {
  return (
    <div className="row g-3">
      {products.map((p) => (
        <div key={p.id} className="col-md-6 col-lg-4">
          <div className="card h-100">
            <img
              src={p.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"}
              className="card-img-top"
              style={{ height: "200px", objectFit: "cover" }}
              alt={p.title}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop";
              }}
            />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{p.title || "Untitled Product"}</h5>
              <p className="text-muted">{p.category || "Uncategorized"}</p>
              <p className="card-text flex-grow-1">
                {p.description || "No description available."}
              </p>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <h4 className="text-success mb-0">${p.price?.toFixed(2) || "0.00"}</h4>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => editProduct(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteProduct(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {(p.feedbacks && p.feedbacks.length > 0) && (
                <div className="mt-3">
                  <small className="text-muted">Feedbacks: {p.feedbacks.length}</small>
                  <div className="mt-2">
                    {p.feedbacks.slice(0, 2).map((fb, idx) => (
                      <div key={idx} className="d-flex justify-content-between align-items-center">
                        <small>{fb.comment || fb.user}</small>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteFeedback(p.id, fb.id || idx)}
                          style={{ fontSize: "0.7rem" }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}