import Navbar from "./Navbar";
import "./css/order-confirmed.css";
import type { NearbyItem } from "./ItemDetails";

type OrderConfirmedProps = {
  item: NearbyItem | null;
  onViewOrderDetail: () => void;
  onContinueShopping: () => void;
  token: string | null;
  onLogout?: () => void;
  onMyPost?: () => void;
  onMyOrders?: () => void;
};

export default function OrderConfirmed({
  item,
  onViewOrderDetail,
  onContinueShopping,
  token,
  onLogout,
  onMyPost,
  onMyOrders,
}: OrderConfirmedProps) {
  // Generate a random order number
  const orderNumber = `#EC-${Date.now().toString().slice(-9)}`;
  
  // Calculate estimated delivery date (3 days from now)
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 3);
  const formattedDate = estimatedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!item) {
    return (
      <div className="order-confirmed-screen">
        <div className="order-confirmed-container">
          <div className="order-error">
            <p>Tidak ada data pesanan. Silakan coba lagi.</p>
          </div>
        </div>
      </div>
    );
  }

  // Extract weight from item (e.g., "1kg" -> "1")
  const weight = item.weight.replace(/[^0-9.]/g, "");

  return (
    <div className="order-confirmed-screen">
      <Navbar
        token={token}
        onLogout={onLogout}
        onMyPost={onMyPost}
        onMyOrders={onMyOrders}
        showSearch={false}
      />

      <div className="order-confirmed-container">
        {/* SUCCESS ICON */}
        <div className="success-icon">
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* HEADING */}
        <h1 className="order-title">Order Confirmed</h1>
        <p className="order-subtitle">
          Thank you for contributing to a more sustainable future.
        </p>

        {/* ORDER INFO */}
        <div className="order-info-grid">
          <div className="order-info-item">
            <span className="info-label">ORDER NUMBER</span>
            <span className="info-value">{orderNumber}</span>
          </div>
          <div className="order-info-item">
            <span className="info-label">ESTIMATED DELIVERY</span>
            <span className="info-value">{formattedDate}</span>
          </div>
        </div>

        {/* SAVED BANNER */}
        <div className="saved-banner">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            <polyline points="16 12 12 8 8 12" />
            <line x1="12" y1="16" x2="12" y2="8" />
          </svg>
          <div className="saved-content">
            <span className="saved-text">
              {`You just saved ${weight}kg with this purchase.`}
            </span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="action-buttons">
          <button className="btn-view-detail" onClick={onViewOrderDetail}>
            View Order Detail
          </button>
          <button className="btn-continue-shopping" onClick={onContinueShopping}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
