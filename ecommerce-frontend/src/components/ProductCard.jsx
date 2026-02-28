import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const discountedPrice = product.discount > 0
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    alert(`${product.title} added to cart!`);
  };

  return (
    <div className="card h-100 product-card position-relative">
      <div className="position-relative">
        <img
          src={product.image || product.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"}
          className="card-img-top"
          alt={product.title}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop";
          }}
        />
        <span className="position-absolute top-0 start-0 bg-success text-white px-2 py-1 m-2 rounded">
          {product.category || 'Uncategorized'}
        </span>
        {product.isPack && (
          <span className="position-absolute top-0 end-0 bg-info text-white px-2 py-1 m-2 rounded">
            Pack
          </span>
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.title || 'Untitled Product'}</h5>
        <p className="text-muted mb-2 small">{product.category || 'General'}</p>
        <p className="card-text flex-grow-1">{product.description?.substring(0, 80) || 'No description available'}...</p>
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            {product.discount > 0 ? (
              <div>
                <span className="text-muted text-decoration-line-through me-2">
                  ${product.price?.toFixed(2)}
                </span>
                <span className="h4 mb-0 text-success">${discountedPrice.toFixed(2)}</span>
                <span className="badge bg-danger ms-2">-{product.discount}%</span>
              </div>
            ) : (
              <span className="h4 mb-0 text-success">${product.price?.toFixed(2)}</span>
            )}
            {product.feedbacks?.length > 0 && (
              <span className="badge bg-warning text-dark">
                <i className="bi bi-star-fill me-1"></i>
                {(product.feedbacks.reduce((acc, f) => acc + f.rating, 0) / product.feedbacks.length).toFixed(1)}
              </span>
            )}
          </div>
          <div className="d-grid gap-2">
            <Link className="btn btn-outline-success" to={`/product/${product._id || product.id}`}>
              View Details
            </Link>
            <button className="btn btn-success" onClick={handleAddToCart}>
              <i className="bi bi-cart-plus me-2"></i>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}