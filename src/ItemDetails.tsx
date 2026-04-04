import Navbar from "./Navbar";
import "./css/item-details.css";
import img1 from "./assets/images/daurulang.jpg";
import img2 from "./assets/images/jualsampah.jpg";
import img3 from "./assets/images/kebersihanlingkungan.jpg";

export type NearbyItem = {
  id: string;
  title: string;
  type: string;
  categoryId: string;
  location: string;
  weight: string;
  price: string;
  badge: string;
};

type ItemDetailsProps = {
  item: NearbyItem | null;
  onBack: () => void;
  onCheckout?: () => void;
  token: string | null;
  onLogout?: () => void;
  onMyPost?: () => void;
  onMyOrders?: () => void;
};

function getItemImage(item: NearbyItem) {
  switch (item.categoryId) {
    case "plastic":
      return img1;
    case "glass":
      return img2;
    case "tin":
      return img3;
    case "cardboard":
      return img1;
    case "patchwork":
      return img2;
    case "paper":
      return img3;
    default:
      return img1;
  }
}

export default function ItemDetails({ item, onBack, onCheckout, token, onLogout, onMyPost, onMyOrders }: ItemDetailsProps) {
  if (!item) {
    return (
      <div className="item-details-page">
        <Navbar 
          token={token} 
          onLogout={onLogout}
          onMyPost={onMyPost}
          showSearch={false}
        />  
        <div className="item-details-screen item-details-empty">
          <div className="item-details-header">
            <button className="item-details-back" type="button" onClick={onBack}>
              <span>Back</span>
            </button>
            <h2>Item Details</h2>
          </div>
          <div className="item-details-missing">
            <p>Item tidak ditemukan. Silakan kembali ke dashboard untuk memilih item.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="item-details-page">
      <Navbar 
        token={token} 
        onLogout={onLogout}
        onMyPost={onMyPost}
        onMyOrders={onMyOrders}
        showSearch={false}
      />
      <div className="item-details-screen">
        <div className="item-details-header">
          <button className="item-details-back" type="button" onClick={onBack}>
            <span>Back</span>
          </button>
          <h2>Detail</h2>
        </div>

      <div className="item-details-container">
        <div className="item-details-left">
          <div className="item-details-image-box">
            <img
              src={getItemImage(item)}
              alt={item.title}
              className="item-details-image-main"
            />
          </div>

          <div className="item-details-thumbs">
            {[1, 2, 3].map((thumb) => (
              <button
                key={thumb}
                type="button"
                className="item-details-thumb"
                aria-label={`Thumbnail ${thumb}`}
              />
            ))}
          </div>
        </div>

        <div className="item-details-right">
          <div className="item-details-title-group">
            <h1>{item.title}</h1>
            <p className="item-details-price">{item.price}</p>
          </div>

          <div className="item-details-meta-grid">
            <div>
              <span>Reward</span>
              <strong>30+ Points</strong>
            </div>
            <div>
              <span>Condition</span>
              <strong>{item.badge}</strong>
            </div>
            <div>
              <span>Weight</span>
              <strong>{item.weight}</strong>
            </div>
            <div>
              <span>Location</span>
              <strong>{item.location}</strong>
            </div>
          </div>

          <button className="item-details-action" type="button" onClick={onCheckout}>
            Pickup Item
          </button>

          <div className="item-details-seller-card">
            <div className="item-details-seller-avatar">S</div>
            <div>
              <div className="item-details-seller-name">Sarah Amelia</div>
              <div className="item-details-seller-status">online</div>
            </div>
          </div>

          <div className="item-details-description">
            <h3>Description</h3>
            <p>
              Contribute to a greener planet by picking up this collection of high-quality {item.type.toLowerCase()} waste.
              These items have been carefully sorted and prepared to ensure they are ready for immediate upcycling or professional recycling processes.
              Ideal for eco-conscious collectors, UMKM crafters, or industrial recycling partners looking for clean raw materials.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
