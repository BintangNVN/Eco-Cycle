import Navbar from "../components/Navbar";
import type { Order } from "../types";
import "../styles/css/order-confirmed.css";

type OrderDetailProps = {
  order: Order | null;
  onBack: () => void;
  token: string | null;
  onLogout?: () => void;
  onMyPost?: () => void;
  onMyOrders?: () => void;
};

const statusSteps = ["Processing", "Packed", "Out for Delivery", "Delivered"] as const;

export default function OrderDetail({ order, onBack, token, onLogout, onMyPost, onMyOrders }: OrderDetailProps) {
  if (!order) {
    return (
      <div className="order-detail-screen">
        <div className="order-detail-container">
          <div className="order-error">
            <p>Order tidak ditemukan. Silakan kembali ke daftar pesanan.</p>
          </div>
        </div>
      </div>
    );
  }

  const activeIndex = statusSteps.findIndex((step) => step === order.status);

  return (
    <div className="order-detail-screen">
      <Navbar
        token={token}
        onLogout={onLogout}
        onMyPost={onMyPost}
        onMyOrders={onMyOrders}
        showSearch={false}
      />

      <div className="order-detail-container">
        <div className="detail-header">
          <button className="detail-back" type="button" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <div>
            <h1>Order Detail</h1>
            
          </div>
        </div>

        <div className="order-progress">
          {statusSteps.map((step, index) => {
            const active = index <= activeIndex;
            return (
              <div key={step} className="progress-step">
                <div className={`progress-dot ${active ? "active" : "inactive"}`} />
                <div className="progress-label">
                  <strong>{step}</strong>
                  <span>{index <= activeIndex ? "Completed" : "Pending"}</span>
                </div>
                {index < statusSteps.length - 1 && (
                  <div className={`progress-line ${index < activeIndex ? "active" : "inactive"}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="order-detail-grid">
          <div className="items-ordered detail-card">
            <div className="card-title-large">Items Ordered</div>
            <div className="product-item-detail">
              <div className="product-image-placeholder detail-placeholder" />
              <div className="product-details-detail">
                <div className="product-title-detail">{order.item.title}</div>
                <div className="product-type-detail">Category: {order.item.type}</div>
                <div className="product-weight-detail">Weight: {order.item.weight}</div>
              </div>
              <div className="product-price-detail">{order.item.price}</div>
            </div>
          </div>

          <div className="order-detail-right">
            <div className="detail-card delivery-details">
              <div className="card-title-large">Delivery Details</div>
              <div className="delivery-section">
                <span className="section-label">Shipping Address</span>
                <p className="delivery-text">{order.shippingAddress.name}</p>
                <p className="delivery-text">{order.shippingAddress.phone}</p>
                <p className="delivery-text">{order.shippingAddress.street}</p>
              </div>
            
              <div className="delivery-section">
                <span className="section-label">Shipping Method</span>
                <div className="delivery-method-row">
                  <div className="delivery-box-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a8c7a" strokeWidth="2">
                      <path d="M16 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                      <path d="M6 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                      <path d="M3 5h13l4 6v5h-1"/>
                      <path d="M3 11h16"/>
                    </svg>
                  </div>
                  <div>
                    <div className="delivery-method-name">{order.shippingMethod}</div>
                    <div className="delivery-method-subtext">Est. Delivery: {order.estimatedDelivery}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-card order-summary-card">
              <div className="card-title-large">Order Summary</div>
              <div className="summary-list">
                <div className="summary-row">
                  <span>Order Summary ({order.item.weight} {order.item.type})</span>
                  <span>{order.item.price}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping Fee</span>
                  <span>Rp{order.shippingFee.toLocaleString("id-ID")}</span>
                </div>
                <div className="summary-row">
                  <span>Eco-Packaging</span>
                  <span className="text-success">Free</span>
                </div>
              </div>
              <div className="summary-total-row">
                <span>Total Amount</span>
                <span>Rp{(order.shippingFee + parseInt(order.item.price.replace(/\D/g, ""), 10)).toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
