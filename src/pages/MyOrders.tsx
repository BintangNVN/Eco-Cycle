import Navbar from "../components/Navbar";
import type { Order } from "../types";
import "../styles/css/order-confirmed.css";

type MyOrdersProps = {
  orders: Order[];
  onBack: () => void;
  onViewOrderDetail: (orderNumber: string) => void;
  token: string | null;
  onLogout?: () => void;
  onMyPost?: () => void;
  onMyOrders?: () => void;
};

export default function MyOrders({ orders, onBack, onViewOrderDetail, token, onLogout, onMyPost, onMyOrders }: MyOrdersProps) {
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
            <h1>My Orders</h1>
            <p className="detail-subtitle">View and monitor your latest orders from the profile section.</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="order-history-empty">
            <p>Tidak ada pesanan saat ini. Lakukan pemesanan untuk melihat riwayat di sini.</p>
          </div>
        ) : (
          <div className="order-history-list">
            {orders.map((order) => (
              <div key={order.orderNumber} className="order-history-card">
                <div className="order-history-top">
                  <div>
                    <div className="order-history-number">{order.orderNumber}</div>
                    <div className="order-history-status">{order.status}</div>
                  </div>
                  <div className="order-history-price">Rp{(parseInt(order.item.price.replace(/\D/g, ""), 10) + order.shippingFee).toLocaleString("id-ID")}</div>
                </div>
                <div className="order-history-item">
                  <div className="product-image-placeholder detail-placeholder" />
                  <div className="product-details-detail">
                    <div className="product-title-detail">{order.item.title}</div>
                    <div className="product-type-detail">Category: {order.item.type}</div>
                    <div className="product-weight-detail">Weight: {order.item.weight}</div>
                  </div>
                </div>
                <button className="btn-view-detail" type="button" onClick={() => onViewOrderDetail(order.orderNumber)}>
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
