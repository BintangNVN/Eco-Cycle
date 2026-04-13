import { useEffect, useMemo, useState } from "react";
import type { NearbyItem } from "./ItemDetails";
import type { ReactNode } from "react";
import "../styles/css/dashboard.css";
import { getUsers, logout } from "../services/api";
import img1 from "../assets/images/daurulang.jpg";
import img2 from "../assets/images/jualsampah.jpg";
import img3 from "../assets/images/kebersihanlingkungan.jpg";

type DashboardProps = {
  token: string | null;
  onLogout: () => void;
  initialCategoryId?: string | null;
  onCategoryNavigate?: (categoryId?: string | null) => void;
  onViewDetails: (item: NearbyItem) => void;
  onMyPost?: () => void;
  onMyOrders?: () => void;
};

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


const sliderImages = [
  {
    title: "Ayo Daur Ulang!",
    subtitle: "Temukan mudah sampah daur ulang terdekat",
    image: img1,
  },
  {
    title: "Jual Sampahmu",
    subtitle: "Dapatkan nilai terbaik untuk sampah plastik, kertas, dan logam Anda",
    image: img2,
  },
  {
    title: "Bersih dan Ramah Lingkungan",
    subtitle: "Satu langkah kecil untuk masa depan hijau",
    image: img3,
  },
];

const categories: Category[] = [
  { id: "plastic", label: "Plastic", emoji: "🧴", icon: "🍶", iconComponent: <PlasticIcon /> },
  { id: "glass", label: "Glass", emoji: "🍾", icon: "🍾", iconComponent: <GlassIcon /> },
  { id: "tin", label: "Tin", emoji: "🥫", icon: "🥫", iconComponent: <TinIcon /> },
  { id: "cardboard", label: "Cardboard", emoji: "📦", icon: "📦", iconComponent: <CardboardIcon /> },
  { id: "patchwork", label: "Patchwork", emoji: "🧵", icon: "🧵", iconComponent: <PatchworkIcon /> },
  { id: "paper", label: "Paper", emoji: "📰", icon: "📰", iconComponent: <PaperIcon /> },
];

const allItems: NearbyItem[] = [
  { id: "item-1", title: "Plastic Bottle Waste", type: "Plastic", categoryId: "plastic", location: "Pondok Kelapa, Jakarta Timur", weight: "1kg", price: "Rp5.000", badge: "Cleaned" },
  { id: "item-2", title: "Plastic Container Bundle", type: "Plastic", categoryId: "plastic", location: "Pondok Indah, Jakarta Selatan", weight: "2.5kg", price: "Rp8.000", badge: "Cleaned" },
  { id: "item-3", title: "Plastic Bag Collection", type: "Plastic", categoryId: "plastic", location: "Cipete, Jakarta Selatan", weight: "0.5kg", price: "Rp2.000", badge: "Available" },
  { id: "item-4", title: "Plastic Bottle Mix", type: "Plastic", categoryId: "plastic", location: "Tebet, Jakarta Selatan", weight: "1.5kg", price: "Rp6.000", badge: "Cleaned" },
  { id: "item-5", title: "Transparent Plastic Sheets", type: "Plastic", categoryId: "plastic", location: "Kemang, Jakarta Selatan", weight: "3kg", price: "Rp10.000", badge: "Available" },
  { id: "item-6", title: "Plastic Waste Pack", type: "Plastic", categoryId: "plastic", location: "Pancoran, Jakarta Selatan", weight: "2kg", price: "Rp7.000", badge: "Unprocessed" },
  { id: "item-7", title: "Glass Bottle Deposit", type: "Glass", categoryId: "glass", location: "Bekasi, Jawa Barat", weight: "0.8kg", price: "Rp10.000", badge: "Available" },
  { id: "item-8", title: "Clear Glass Jars", type: "Glass", categoryId: "glass", location: "Condet, Jakarta Timur", weight: "1.2kg", price: "Rp12.000", badge: "Cleaned" },
  { id: "item-9", title: "Green Glass Bottles", type: "Glass", categoryId: "glass", location: "Kramat Jati, Jakarta Timur", weight: "2kg", price: "Rp15.000", badge: "Cleaned" },
  { id: "item-10", title: "Mixed Glass Collection", type: "Glass", categoryId: "glass", location: "Jati Baru, Jakarta Utara", weight: "3kg", price: "Rp18.000", badge: "Available" },
  { id: "item-11", title: "Brown Glass Containers", type: "Glass", categoryId: "glass", location: "Penjaringan, Jakarta Utara", weight: "1.5kg", price: "Rp11.000", badge: "Cleaned" },
  { id: "item-12", title: "Glass Bottle Set", type: "Glass", categoryId: "glass", location: "Sunter, Jakarta Utara", weight: "2.5kg", price: "Rp16.000", badge: "Available" },
  { id: "item-13", title: "Aluminum Can Collection", type: "Tin", categoryId: "tin", location: "Cikini, Jakarta Pusat", weight: "0.5kg", price: "Rp8.000", badge: "Cleaned" },
  { id: "item-14", title: "Tin Can Bundle", type: "Tin", categoryId: "tin", location: "Menteng, Jakarta Pusat", weight: "1kg", price: "Rp12.000", badge: "Available" },
  { id: "item-15", title: "Beverage Can Mix", type: "Tin", categoryId: "tin", location: "Gambir, Jakarta Pusat", weight: "0.8kg", price: "Rp10.000", badge: "Cleaned" },
  { id: "item-16", title: "Metal Tin Containers", type: "Tin", categoryId: "tin", location: "Palmerah, Jakarta Barat", weight: "1.5kg", price: "Rp14.000", badge: "Available" },
  { id: "item-17", title: "Food Can Collection", type: "Tin", categoryId: "tin", location: "Grogol, Jakarta Barat", weight: "2kg", price: "Rp16.000", badge: "Cleaned" },
  { id: "item-18", title: "Aluminum Foil Pack", type: "Tin", categoryId: "tin", location: "Tanjung Priok, Jakarta Utara", weight: "0.6kg", price: "Rp9.000", badge: "Available" },
  { id: "item-19", title: "Cardboard Box Stack", type: "Cardboard", categoryId: "cardboard", location: "Kramat Jati, Jakarta Timur", weight: "3kg", price: "Rp5.000", badge: "Available" },
  { id: "item-20", title: "Corrugated Paper Bundle", type: "Cardboard", categoryId: "cardboard", location: "Matraman, Jakarta Timur", weight: "4kg", price: "Rp6.000", badge: "Cleaned" },
  { id: "item-21", title: "Kraft Cardboard Sheets", type: "Cardboard", categoryId: "cardboard", location: "Ciracas, Jakarta Timur", weight: "2.5kg", price: "Rp4.000", badge: "Available" },
  { id: "item-22", title: "Shipping Boxes", type: "Cardboard", categoryId: "cardboard", location: "Cawang, Jakarta Timur", weight: "5kg", price: "Rp7.000", badge: "Cleaned" },
  { id: "item-23", title: "Flattened Cardboard", type: "Cardboard", categoryId: "cardboard", location: "Pulo Gadung, Jakarta Timur", weight: "3.5kg", price: "Rp5.500", badge: "Available" },
  { id: "item-24", title: "Brown Cardboard Mix", type: "Cardboard", categoryId: "cardboard", location: "Rawa Jati, Jakarta Timur", weight: "4.5kg", price: "Rp6.500", badge: "Cleaned" },
  { id: "item-25", title: "Paper Waste Bundle", type: "Paper", categoryId: "paper", location: "Cibubur, Jakarta Timur", weight: "2kg", price: "Free", badge: "Unprocessed" },
  { id: "item-26", title: "Newspaper Collection", type: "Paper", categoryId: "paper", location: "Kertamukti, Jakarta Timur", weight: "3kg", price: "Free", badge: "Available" },
  { id: "item-27", title: "Magazine Stack", type: "Paper", categoryId: "paper", location: "Pulogadung, Jakarta Timur", weight: "2.5kg", price: "Free", badge: "Unprocessed" },
  { id: "item-28", title: "Office Paper Waste", type: "Paper", categoryId: "paper", location: "Cilangkap, Jakarta Timur", weight: "4kg", price: "Rp2.000", badge: "Cleaned" },
  { id: "item-29", title: "White Paper Bundle", type: "Paper", categoryId: "paper", location: "Segara, Jakarta Timur", weight: "1.5kg", price: "Rp1.500", badge: "Available" },
  { id: "item-30", title: "Mixed Paper Collection", type: "Paper", categoryId: "paper", location: "Ujung Menteng, Jakarta Timur", weight: "3.5kg", price: "Free", badge: "Available" },
  { id: "item-31", title: "Fabric Scrap Collection", type: "Patchwork", categoryId: "patchwork", location: "Kebon Sirih, Jakarta Pusat", weight: "1kg", price: "Rp3.000", badge: "Available" },
  { id: "item-32", title: "Cotton Waste Bundle", type: "Patchwork", categoryId: "patchwork", location: "Gambir, Jakarta Pusat", weight: "1.5kg", price: "Rp4.000", badge: "Cleaned" },
  { id: "item-33", title: "Textile Leftovers", type: "Patchwork", categoryId: "patchwork", location: "Palmerah, Jakarta Barat", weight: "2kg", price: "Rp5.000", badge: "Available" },
  { id: "item-34", title: "Polyester Scraps", type: "Patchwork", categoryId: "patchwork", location: "Tanah Abang, Jakarta Pusat", weight: "1.2kg", price: "Rp3.500", badge: "Cleaned" },
  { id: "item-35", title: "Wool Waste Collection", type: "Patchwork", categoryId: "patchwork", location: "Kemayoran, Jakarta Pusat", weight: "2.5kg", price: "Rp6.000", badge: "Available" },
  { id: "item-36", title: "Mixed Fabric Bundle", type: "Patchwork", categoryId: "patchwork", location: "Senen, Jakarta Pusat", weight: "1.8kg", price: "Rp4.500", badge: "Cleaned" },
];

const nearbyItems: NearbyItem[] = allItems.slice(0, 3);


function getBadgeClass(badge: string) {
  if (badge === "Cleaned") return "tag tag-cleaned";
  if (badge === "Available") return "tag tag-available";
  if (badge === "Unprocessed") return "tag tag-unprocessed";
  return "tag tag-type";
}

function ItemCard({ item, onViewDetails }: { item: NearbyItem; onViewDetails: (item: NearbyItem) => void }) {
  const categoryIcon = categories.find(c => c.id === item.categoryId)?.iconComponent;
  return (
    <div className="item-card">
      <div className="card-img-wrap">
        <div className="card-img-placeholder" style={{ color: "#1a8c7a" }}>
          {categoryIcon || "♻️"}
        </div>
      </div>
      <div className="card-body">
        <div className="card-meta-top">
          <div className="card-location">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {item.location}
          </div>
          <span className="card-weight">{item.weight}</span>
        </div>
        <div className="card-title">{item.title}</div>
        <div className="card-tags">
          <span className="tag tag-type">{item.type}</span>
          <span className={getBadgeClass(item.badge)}>{item.badge}</span>
        </div>
      </div>
      <div className="card-footer">
        <div className="card-price">{item.price}</div>
        <button className="card-view-btn" type="button" onClick={() => onViewDetails(item)}>
          View Details
        </button>
      </div>
    </div>
  );
}

export default function Dashboard({ token, onLogout, initialCategoryId, onCategoryNavigate, onViewDetails, onMyPost, onMyOrders }: DashboardProps) {
  const [users, setUsers] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategoryId ?? null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    setSelectedCategory(initialCategoryId ?? null);
  }, [initialCategoryId]);

  const currentUser = useMemo(() => {
    if (users.length > 0) return users[0];
    return { name: "Pengguna", email: "user@example.com" };
  }, [users]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const q = searchTerm.toLowerCase();
    return categories.filter((cat) => cat.label.toLowerCase().includes(q));
  }, [searchTerm]);

  const filteredNearby = useMemo(() => {
    if (!searchTerm.trim()) return nearbyItems;
    const q = searchTerm.toLowerCase();
    return nearbyItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  const categoryItems = useMemo(() => {
    if (!selectedCategory) return [];
    const items = allItems.filter((item) => item.categoryId === selectedCategory);
    if (!searchTerm.trim()) return items;
    const q = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
    );
  }, [selectedCategory, searchTerm]);

  const selectedCategoryData = useMemo(() => {
    if (!selectedCategory) return null;
    return categories.find((cat) => cat.id === selectedCategory) || null;
  }, [selectedCategory]);

  useEffect(() => {
    if (!token) { setUsers([]); return; }
    let canceled = false;
    async function loadUsers() {
      setLoading(true); setError(null);
      try {
        const response = await getUsers(token || undefined);
        if (!canceled) setUsers(response.data ?? []);
      } catch (err) {
        if (!canceled) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    loadUsers();
    return () => { canceled = true; };
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.profile-dropdown-container')) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  const handleLogout = async () => {
    if (!token) { onLogout(); return; }
    try { await logout(token); } catch {}
    onLogout();
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleMyOrdersClick = () => {
    setShowProfileDropdown(false);
    onMyOrders?.();
  };

  const handleMyPostClick = () => {
    setShowProfileDropdown(false);
    onMyPost?.();
  };

  const handleViewDetails = (item: NearbyItem) => {
    onViewDetails(item);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSearchTerm("");
    setSelectedCategory(categoryId);
    onCategoryNavigate?.(categoryId);
  };

  const handleCategoryBack = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    onCategoryNavigate?.();
  };

  return (
    <div className="eco-app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a8c7a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10"/>
            <polyline points="23 20 23 14 17 14"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
          EcoCycle
        </div>

        <div className="navbar-search">
          <svg className="navbar-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for anything..."
          />
        </div>

        <div className="navbar-right">
          <div className="navbar-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a8c7a" strokeWidth="2.2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Bogor, Indonesia
          </div>

          {token && (
            <div className="navbar-user">
              Hi, {currentUser.name}
            </div>
          )}

          <button className="navbar-cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </button>

          {token ? (
            <>
              <div className="profile-dropdown-container">
                <img
                  src="https://i.pravatar.cc/72"
                  alt="Avatar"
                  className="navbar-avatar"
                  onClick={handleProfileClick}
                  style={{ cursor: 'pointer' }}
                />
                {showProfileDropdown && (
                  <div className="profile-dropdown">
                    <button className="dropdown-item" onClick={handleMyOrdersClick}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 7h18v14H3z"/>
                        <path d="M3 11h18"/>
                        <path d="M7 7v-3"/>
                      </svg>
                      My Orders
                    </button>
                    <button className="dropdown-item" onClick={handleMyPostClick}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10,9 9,9 8,9"/>
                      </svg>
                      My Post
                    </button>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16,17 21,12 16,7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button className="btn-outline">Login</button>
              <button className="btn-primary">Register</button>
            </>
          )}
        </div>
      </nav>

      {/* MAIN */}
      <div className="main-content">
        {loading && <div className="dashboard-status">Memuat data pengguna...</div>}
        {error && <div className="dashboard-status dashboard-error">{error}</div>}

        {selectedCategory && selectedCategoryData ? (
          <>
            <div className="cat-header">
              <button className="back-btn" onClick={handleCategoryBack}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Back
              </button>
              <h2 className="cat-title">
                {selectedCategoryData.label}
              </h2>
            </div>

            {categoryItems.length > 0 ? (
              <div className="cards-grid">
                {categoryItems.map((item) => (
                  <ItemCard key={item.id} item={item} onViewDetails={handleViewDetails} />
                ))}
              </div>
            ) : (
              <div className="cards-grid">
                <div className="empty-state">Tidak ada barang ditemukan.</div>
              </div>
            )}
          </>

        ) : (
          /* ─── MAIN DASHBOARD VIEW ─── */
          <>
            {/* SLIDER */}
            <div className="slider-wrap">
              <img
                src={sliderImages[slideIndex].image}
                alt="Slide"
                className="slider-img"
              />
              <div className="slider-overlay">
                <h2>{sliderImages[slideIndex].title}</h2>
                <p>{sliderImages[slideIndex].subtitle}</p>
              </div>
              <div className="slider-dots">
                {sliderImages.map((_, idx) => (
                  <button
                    key={idx}
                    className={`slider-dot${idx === slideIndex ? " active" : ""}`}
                    onClick={() => setSlideIndex(idx)}
                  />
                ))}
              </div>
            </div>

            {/* CATEGORIES */}
            <div className="section-header">
              <div className="section-title">Categories</div>
            </div>
            <div className="categories-grid">
              {filteredCategories.map((cat) => (
                <button key={cat.id} className="category-item" onClick={() => handleCategorySelect(cat.id)}>
                  <div className="category-circle" style={{ color: "#1a8c7a" }}>
                    {cat.iconComponent}
                  </div>
                  <span className="category-label">{cat.label}</span>
                </button>
              ))}
            </div>

            {/* NEARBY */}
            <div className="section-header">
              <div className="section-title">Nearby You</div>
              <button className="view-all-btn">
                View All
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>

            <div className="cards-grid">
              {filteredNearby.length > 0 ? (
                filteredNearby.map((item) => <ItemCard key={item.id} item={item} onViewDetails={handleViewDetails} />)
              ) : (
                <div className="empty-state">Tidak ada barang terdekat sesuai pencarian.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}