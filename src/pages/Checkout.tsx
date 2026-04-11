import Navbar from "../components/Navbar";
import { useState } from "react";
import "../styles/css/checkout.css";
import type { NearbyItem } from "./ItemDetails";
import type { ReactNode } from "react";

type Category = {
  id: string;
  label: string;
  emoji: string;
  icon: string;
  iconComponent?: ReactNode;
};

// SVG Icons for categories
const PlasticIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 2h10l2 7H5l2-7z"/>
    <rect x="5" y="9" width="14" height="11" rx="1"/>
    <line x1="12" y1="9" x2="12" y2="20"/>
    <circle cx="9" cy="15" r="0.5" fill="currentColor"/>
    <circle cx="15" cy="15" r="0.5" fill="currentColor"/>
  </svg>
);

const GlassIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 3h12l-1 8c0 2-1 3-5 3s-5-1-5-3L6 3z"/>
    <line x1="8" y1="14" x2="16" y2="14"/>
    <path d="M7 14l-1 6c0 1 1 2 2 2h8c1 0 2-1 2-2l-1-6"/>
  </svg>
);

const TinIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="6" y="4" width="12" height="14" rx="1"/>
    <line x1="6" y1="8" x2="18" y2="8"/>
    <line x1="6" y1="12" x2="18" y2="12"/>
    <path d="M9 2h6v2H9z"/>
    <line x1="8" y1="19" x2="16" y2="19"/>
    <line x1="9" y1="22" x2="15" y2="22"/>
  </svg>
);

const CardboardIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="1"/>
    <path d="M3 3l18 18"/>
    <path d="M21 3L3 21"/>
    <line x1="12" y1="3" x2="12" y2="21"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
  </svg>
);

const PatchworkIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="8" height="8"/>
    <rect x="13" y="3" width="8" height="8"/>
    <rect x="3" y="13" width="8" height="8"/>
    <rect x="13" y="13" width="8" height="8"/>
    <line x1="3" y1="11" x2="21" y2="11"/>
    <line x1="11" y1="3" x2="11" y2="21"/>
  </svg>
);

const PaperIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="2" width="14" height="20" rx="1"/>
    <line x1="9" y1="7" x2="15" y2="7"/>
    <line x1="9" y1="11" x2="15" y2="11"/>
    <line x1="9" y1="15" x2="15" y2="15"/>
  </svg>
);

const categories: Category[] = [
  { id: "plastic", label: "Plastic", emoji: "🧴", icon: "🍶", iconComponent: <PlasticIcon /> },
  { id: "glass", label: "Glass", emoji: "🍾", icon: "🍾", iconComponent: <GlassIcon /> },
  { id: "tin", label: "Tin", emoji: "🥫", icon: "🥫", iconComponent: <TinIcon /> },
  { id: "cardboard", label: "Cardboard", emoji: "📦", icon: "📦", iconComponent: <CardboardIcon /> },
  { id: "patchwork", label: "Patchwork", emoji: "🧵", icon: "🧵", iconComponent: <PatchworkIcon /> },
  { id: "paper", label: "Paper", emoji: "📰", icon: "📰", iconComponent: <PaperIcon /> },
];

// SVG Icons for shipping and payment
const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const DeliveryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13"/>
    <polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/>
    <circle cx="5.5" cy="18.5" r="1.5"/>
    <circle cx="18.5" cy="18.5" r="1.5"/>
  </svg>
);

const StoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const MotorcycleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
    <path d="M5 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
    <path d="M12 17h3l1-3 2-3h2"/>
    <path d="M5 6h14"/>
    <path d="M5 10h3"/>
  </svg>
);

const CreditCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const BankIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const MobileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
    <circle cx="8" cy="10" r="1"/>
    <circle cx="12" cy="10" r="1"/>
    <circle cx="16" cy="10" r="1"/>
  </svg>
);

type CheckoutProps = {
  item: NearbyItem | null;
  onBack: () => void;
  onOrderConfirm?: () => void;
  token: string | null;
  onLogout?: () => void;
  onMyPost?: () => void;
  onMyOrders?: () => void;
};

type ShippingOption = {
  id: string;
  name: string;
  time: string;
  price: number;
  icon: string;
  iconComponent?: ReactNode;
};

type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
  iconComponent?: ReactNode;
};

const shippingOptions: ShippingOption[] = [
  {
    id: "delivery",
    name: "Delivery",
    time: "2-3 business days",
    price: 15000,
    icon: "🚚",
    iconComponent: <DeliveryIcon />,
  },
  {
    id: "pickup",
    name: "Pickup",
    time: "Ready in 2 hours",
    price: 0,
    icon: "🏪",
    iconComponent: <StoreIcon />,
  },
  {
    id: "seller-delivery",
    name: "Seller Delivery",
    time: "Within 2km radius",
    price: 8000,
    icon: "🛵",
    iconComponent: <MotorcycleIcon />,
  },
];

const paymentMethods: PaymentMethod[] = [
  { id: "cod", name: "COD", icon: "💳", iconComponent: <CreditCardIcon /> },
  { id: "bank", name: "Bank Transfer", icon: "🏦", iconComponent: <BankIcon /> },
  { id: "gopay", name: "GoPay", icon: "📱", iconComponent: <MobileIcon /> },
  { id: "ewallet", name: "E-Wallet", icon: "💰", iconComponent: <WalletIcon /> },
];

export default function Checkout({ item, onBack, onOrderConfirm, token, onLogout, onMyPost, onMyOrders }: CheckoutProps) {
  const [address, setAddress] = useState({
    name: "Sarah Nadia",
    phone: "+62 857 2419 5327",
    street: "Jl. Palem Putri No. 42, RT. 005/RW. 011, Kel. Pondok Kelapa, Kec. Duren Sawit, Jakarta Timur, DKI Jakarta, 13450",
  });

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedAddress, setEditedAddress] = useState(address);
  const [selectedShipping, setSelectedShipping] = useState<string>("delivery");
  const [selectedPayment, setSelectedPayment] = useState<string>("cod");

  const shippingOption = shippingOptions.find((opt) => opt.id === selectedShipping);
  const productPrice = item?.price ? parseInt(String(item.price).replace(/\D/g, ""), 10) || 0 : 0;  const shippingPrice = shippingOption?.price || 0;
  const ecoPackagingPrice = 0;
  const totalPrice = productPrice + shippingPrice + ecoPackagingPrice;

  const handleSaveAddress = () => {
    setAddress(editedAddress);
    setIsEditingAddress(false);
  };

  const handleEditClick = () => {
    setEditedAddress(address);
    setIsEditingAddress(true);
  };

  const handleCancel = () => {
    setIsEditingAddress(false);
  };

  const handleOrder = () => {
    onOrderConfirm?.();
  };

  if (!item) {
    return (
      <div className="checkout-page">
        <Navbar 
          token={token} 
          onLogout={onLogout}
          onMyPost={onMyPost}
          showSearch={false}
        />
        <div className="checkout-screen checkout-empty">
          <div className="checkout-header">
            <button className="checkout-back" type="button" onClick={onBack}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <h2>Checkout</h2>
        </div>
        <div className="checkout-missing">
          <p>Item tidak ditemukan. Silakan kembali ke detail produk.</p>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Navbar 
        token={token} 
        onLogout={onLogout}
        onMyPost={onMyPost}
        onMyOrders={onMyOrders}
        showSearch={false}
      />
      <div className="checkout-screen">
      <div className="checkout-header">
        <button className="checkout-back" type="button" onClick={onBack}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <h2>Checkout</h2>
      </div>

      <div className="checkout-container">
        {/* LEFT SIDE - Main Content */}
        <div className="checkout-main">
          {/* SHIPPING ADDRESS */}
          <div className="checkout-section">
            <div className="checkout-section-header">
              <h3>Shipping Address</h3>
              <button
                type="button"
                className="edit-address-btn"
                onClick={isEditingAddress ? handleCancel : handleEditClick}
              >
                {isEditingAddress ? "Cancel" : "Edit Address"}
              </button>
            </div>

            {isEditingAddress ? (
              <div className="address-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editedAddress.name}
                    onChange={(e) =>
                      setEditedAddress({ ...editedAddress, name: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={editedAddress.phone}
                    onChange={(e) =>
                      setEditedAddress({ ...editedAddress, phone: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    value={editedAddress.street}
                    onChange={(e) =>
                      setEditedAddress({ ...editedAddress, street: e.target.value })
                    }
                    rows={4}
                  />
                </div>
                <button className="btn-save-address" type="button" onClick={handleSaveAddress}>
                  Save Address
                </button>
              </div>
            ) : (
              <div className="address-card">
                <div className="address-icon" style={{ color: "#1a8c7a" }}>
                  <LocationIcon />
                </div>
                <div className="address-content">
                  <div className="address-name">{address.name}</div>
                  <div className="address-phone">{address.phone}</div>
                  <div className="address-text">{address.street}</div>
                </div>
              </div>
            )}
          </div>

          {/* ORDERED PRODUCTS */}
          <div className="checkout-section">
            <h3>Ordered Products</h3>
            <div className="product-list">
              <div className="product-item">
                <div className="product-image">
                  <div className="product-image-placeholder" style={{ color: "#1a8c7a" }}>
                    {categories.find(c => c.id === item.categoryId)?.iconComponent || "♻️"}
                  </div>
                </div>
                <div className="product-details">
                  <div className="product-title">{item.title}</div>
                  <div className="product-type">Category: {item.type}</div>
                  <div className="product-weight">Weight: {item.weight}</div>
                </div>
                <div className="product-price">{item.price}</div>
              </div>
            </div>
          </div>

          {/* SHIPPING OPTIONS */}
          <div className="checkout-section">
            <h3>Shipping Options</h3>
            <div className="shipping-options">
              {shippingOptions.map((option) => (
                <label key={option.id} className="shipping-option">
                  <input
                    type="radio"
                    name="shipping"
                    value={option.id}
                    checked={selectedShipping === option.id}
                    onChange={(e) => setSelectedShipping(e.target.value)}
                  />
                  <div className="shipping-option-content">
                    <div className="shipping-icon" style={{ color: "#1a8c7a" }}>
                      {option.iconComponent}
                    </div>
                    <div className="shipping-info">
                      <div className="shipping-name">{option.name}</div>
                      <div className="shipping-time">{option.time}</div>
                    </div>
                    <div className="shipping-price">
                      {option.price > 0 ? `Rp${option.price.toLocaleString("id-ID")}` : "Free"}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* PAYMENT METHODS */}
          <div className="checkout-section">
            <h3>Payment Methods</h3>
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <label key={method.id} className="payment-method">
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={selectedPayment === method.id}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                  />
                  <div className="payment-method-content">
                    <div className="payment-icon" style={{ color: "#1a8c7a" }}>
                      {method.iconComponent}
                    </div>
                    <div className="payment-name">{method.name}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - ORDER SUMMARY */}
        <div className="checkout-sidebar">
          <div className="order-summary">
            <h3>Order Summary</h3>

            <div className="summary-item">
              <span className="summary-label">Order Summary (1kg Plastic)</span>
              <span className="summary-value">{item.price}</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Shipping Fee</span>
              <span className="summary-value">
                Rp{shippingPrice.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Eco-Packaging</span>
              <span className="summary-value" style={{ color: "#17a697" }}>
                Free
              </span>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span className="summary-label">Total Amount</span>
              <span className="summary-value">Rp{totalPrice.toLocaleString("id-ID")}</span>
            </div>

            <button className="btn-order" type="button" onClick={handleOrder}>
              Order
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
