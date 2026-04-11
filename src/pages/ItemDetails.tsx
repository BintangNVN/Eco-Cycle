import Navbar from "../components/Navbar";
import "../styles/css/item-details.css";
import img1 from "../assets/images/daurulang.jpg";
import img2 from "../assets/images/jualsampah.jpg";
import img3 from "../assets/images/kebersihanlingkungan.jpg";

// 1. UPDATE INTERFACE: Sesuaikan dengan struktur data dari Backend Railway
export type NearbyItem = {
  id: string;
  title?: string;
  name?: string;
  label?: string;
  type?: string;
  categoryId?: string;
  category?: { id: string; name: string };
  location?: string;
  weight?: string | number;
  price?: string | number;
  badge?: string;
  poitRewards?: number | string;
  condition?: string;
  description?: string;
  image?: string[] | string;
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

// Fungsi fallback jika user tidak mengunggah gambar
function getItemImage(item: NearbyItem) {
  const cat = item.categoryId || item.category?.id;
  switch (cat) {
    case "plastic": return img1;
    case "glass": return img2;
    case "tin": return img3;
    case "cardboard": return img1;
    case "patchwork": return img2;
    case "paper": return img3;
    default: return img1;
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

  // === LOGIKA DATA DINAMIS DARI BACKEND ===
  
  // 1. Prioritas Nama/Judul
  const displayTitle = item.name || item.title || item.label || "Untitled Product";
  
  // 2. Harga & Poin
  const displayPrice = item.price ? `Rp ${item.price}` : "Gratis / Tukar Poin";
  const displayPoints = item.poitRewards ? `${item.poitRewards} Points` : "0 Points";
  
  // 3. Kondisi (Translate dari Inggris ke Indonesia)
  const displayCondition = item.condition === 'good' ? 'Bagus' : (item.condition === 'bad' ? 'Rusak' : (item.condition === 'new' ? 'Baru' : item.condition || item.badge || "Tersedia"));
  
  // 4. Deskripsi
  const displayDesc = item.description || "Tidak ada deskripsi detail untuk item ini.";

  // 5. Logika URL Gambar (Sama seperti ItemCard di MyPost)
  const backendBaseUrl = "https://service-capstone-project-production.up.railway.app";
  let mainImageUrl = "";
  let allImages: string[] = [];

  if (item.image) {
    // Pastikan kita handle format array maupun string tunggal
    const rawImages = Array.isArray(item.image) ? item.image : [item.image];
    
    // Konversi semua relative path menjadi URL lengkap
    allImages = rawImages.map(path => {
      if (path.startsWith("http")) return path;
      return path.startsWith("/") ? `${backendBaseUrl}${path}` : `${backendBaseUrl}/${path}`;
    });

    if (allImages.length > 0) {
      mainImageUrl = allImages[0];
    }
  }

  // Jika gagal dapat URL asli, pakai gambar fallback
  if (!mainImageUrl) {
    mainImageUrl = getItemImage(item);
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
          <h2>Detail Produk</h2>
        </div>

      <div className="item-details-container">
        <div className="item-details-left">
          <div className="item-details-image-box">
            <img
              src={mainImageUrl}
              alt={displayTitle}
              className="item-details-image-main"
              style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '12px' }}
              onError={(e) => {
                // Jika URL backend mati/error, ganti ke gambar darurat
                (e.target as HTMLImageElement).src = img1;
              }}
            />
          </div>

          <div className="item-details-thumbs">
            {/* Tampilkan thumbnail dinamis jika gambar > 1, jika tidak pakai 3 kotak dummy */}
            {allImages.length > 1 ? (
              allImages.slice(0, 3).map((img, index) => (
                <button
                  key={index}
                  type="button"
                  className="item-details-thumb"
                  style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover' }}
                  aria-label={`Thumbnail ${index + 1}`}
                />
              ))
            ) : (
              [1, 2, 3].map((thumb) => (
                <button
                  key={thumb}
                  type="button"
                  className="item-details-thumb"
                  aria-label={`Thumbnail dummy ${thumb}`}
                />
              ))
            )}
          </div>
        </div>

        <div className="item-details-right">
          <div className="item-details-title-group">
            <h1>{displayTitle}</h1>
            <p className="item-details-price">{displayPrice}</p>
          </div>

          <div className="item-details-meta-grid">
            <div>
              <span>Reward</span>
              <strong>{displayPoints}</strong>
            </div>
            <div>
              <span>Kondisi</span>
              <strong>{displayCondition}</strong>
            </div>
            <div>
              <span>Berat</span>
              <strong>{item.weight || "0"} kg</strong>
            </div>
            <div>
              <span>Lokasi</span>
              <strong>{item.location || "Bogor, Indonesia"}</strong>
            </div>
          </div>

          <button className="item-details-action" type="button" onClick={onCheckout}>
            Pickup Item
          </button>

          <div className="item-details-seller-card">
            <div className="item-details-seller-avatar">E</div>
            <div>
              <div className="item-details-seller-name">EcoCycle User</div>
              <div className="item-details-seller-status">Active</div>
            </div>
          </div>

          <div className="item-details-description">
            <h3>Deskripsi</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{displayDesc}</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}