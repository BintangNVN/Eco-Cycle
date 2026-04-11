import { useEffect, useMemo, useState } from "react";
import type { NearbyItem } from "./ItemDetails";
import type { ReactNode } from "react";
import "../styles/css/dashboard.css";
// IMPORT API
import { getUsers, logout, getMyPosts, getCategories } from "../services/api/api";
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
  name?: string;
  emoji?: string;
  icon?: string;
  iconComponent?: ReactNode;
};

// Interface data gabungan dari API
interface ExtendNearbyItem extends Omit<NearbyItem, 'weight'> {
  id: string;
  name?: string;
  label?: string;
  poitRewards?: number | string;
  image?: string[]; 
  category?: { id: string; name: string };
  categoryId?: string;
  condition?: string;
  weight?: number | string;
}

// === KUMPULAN ICON SVG ===
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

const getCategoryIcon = (catName: string = "") => {
  const name = catName.toLowerCase();
  if (name.includes('plastic') || name.includes('plastik')) return <PlasticIcon />;
  if (name.includes('glass') || name.includes('kaca')) return <GlassIcon />;
  if (name.includes('tin') || name.includes('kaleng') || name.includes('logam')) return <TinIcon />;
  if (name.includes('cardboard') || name.includes('kardus')) return <CardboardIcon />;
  if (name.includes('patchwork') || name.includes('kain')) return <PatchworkIcon />;
  if (name.includes('paper') || name.includes('kertas')) return <PaperIcon />;
  return <PlasticIcon />; // Default
};

const sliderImages = [
  { title: "Ayo Daur Ulang!", subtitle: "Temukan mudah sampah daur ulang terdekat", image: img1 },
  { title: "Jual Sampahmu", subtitle: "Dapatkan nilai terbaik untuk sampah plastik, kertas, dan logam Anda", image: img2 },
  { title: "Bersih dan Ramah Lingkungan", subtitle: "Satu langkah kecil untuk masa depan hijau", image: img3 },
];

function getBadgeClass(badge: string) {
  if (badge === "Cleaned") return "tag tag-cleaned";
  if (badge === "Available" || badge === "good" || badge === "new") return "tag tag-available";
  if (badge === "Unprocessed" || badge === "bad") return "tag tag-unprocessed";
  return "tag tag-type";
}

// === KOMPONEN ITEM CARD PINTAR ===
function ItemCard({ item, onViewDetails, catIcon }: { item: ExtendNearbyItem; onViewDetails: (item: NearbyItem) => void, catIcon?: ReactNode }) {
  const displayTitle = item.name || item.title || item.label || "Untitled Product";
  const displayPoints = item.poitRewards ? `${item.poitRewards} Coins` : (item.price ? `Rp ${item.price}` : "No Reward");

  const backendBaseUrl = "https://service-capstone-project-production.up.railway.app";
  let imageUrl = "";

  if (item.image && Array.isArray(item.image) && item.image.length > 0) {
    const rawPath = item.image[0]; 
    if (rawPath.startsWith("http")) {
      imageUrl = rawPath; 
    } else {
      imageUrl = rawPath.startsWith("/") ? `${backendBaseUrl}${rawPath}` : `${backendBaseUrl}/${rawPath}`;
    }
  }

  const categoryName = item.category?.name || item.type || "Item";
  const iconToUse = catIcon || getCategoryIcon(categoryName);

  return (
    <div className="item-card">
      <div className="card-img-wrap">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={displayTitle} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} 
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as any).nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        <div className="card-img-placeholder" style={{ color: "#1a8c7a", display: imageUrl ? 'none' : 'flex' }}>
          {iconToUse}
        </div>
      </div>
      <div className="card-body">
        <div className="card-meta-top">
          <div className="card-location">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {item.location || "Bogor, Indonesia"}
          </div>
          <span className="card-weight">{item.weight || "0"} kg</span>
        </div>
        <div className="card-title">{displayTitle}</div>
        <div className="card-tags">
          <span className="tag tag-type">{categoryName}</span>
          <span className={getBadgeClass(item.condition || "Available")}>
            {item.condition === 'good' ? 'Bagus' : (item.condition === 'bad' ? 'Rusak' : (item.condition === 'new' ? 'Baru' : item.condition || "Available"))}
          </span>
        </div>
      </div>
      <div className="card-footer">
        <div className="card-price">{displayPoints}</div>
        <button className="card-view-btn" type="button" onClick={() => onViewDetails(item as unknown as NearbyItem)}>
          View Details
        </button>
      </div>
    </div>
  );
}

export default function Dashboard({ token, onLogout, initialCategoryId, onCategoryNavigate, onViewDetails, onMyPost, onMyOrders }: DashboardProps) {
  const [users, setUsers] = useState<Array<any>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategoryId ?? null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // State Dinamis dari Backend
  const [apiPosts, setApiPosts] = useState<ExtendNearbyItem[]>([]);
  const [apiCategories, setApiCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    setSelectedCategory(initialCategoryId ?? null);
  }, [initialCategoryId]);

  // FETCH DATA POST & KATEGORI
  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      setLoadingData(true);
      try {
        const [postsRes, catsRes] = await Promise.all([getMyPosts(), getCategories()]);
        
        if (isMounted) {
          // Ambil posts dari struktur pagination backend
          const fetchedPosts = Array.isArray(postsRes.data?.data?.posts) 
            ? postsRes.data.data.posts 
            : (Array.isArray(postsRes.data?.data) ? postsRes.data.data : []);
          setApiPosts(fetchedPosts);

          // Ambil kategori
          const fetchedCats = Array.isArray(catsRes.data?.data) ? catsRes.data.data : [];
          setApiCategories(fetchedCats.map((c: any) => ({
            id: c.id,
            label: c.name || c.label,
            name: c.name,
            iconComponent: getCategoryIcon(c.name || c.label)
          })));
        }
      } catch (error) {
        console.error("Gagal memuat data Dashboard:", error);
      } finally {
        if (isMounted) setLoadingData(false);
      }
    };

    fetchDashboardData();
    return () => { isMounted = false; };
  }, []);

  // Fetch Users
  useEffect(() => {
    if (!token) { setUsers([]); return; }
    let canceled = false;
    async function loadUsers() {
      try {
        const response = await getUsers();
        if (!canceled) setUsers(response.data ?? []);
      } catch (err) {}
    }
    loadUsers();
    return () => { canceled = true; };
  }, [token]);

  // Logika Filter Pencarian
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return apiCategories;
    const q = searchTerm.toLowerCase();
    return apiCategories.filter((cat) => (cat.label || cat.name || "").toLowerCase().includes(q));
  }, [searchTerm, apiCategories]);

  // Nearby Items (Ambil maksimal 6 post terbaru agar Dashboard rapi)
  const filteredNearby = useMemo(() => {
    const baseItems = apiPosts.slice(0, 6); // Batasi 6 item
    if (!searchTerm.trim()) return baseItems;
    
    const q = searchTerm.toLowerCase();
    return baseItems.filter(
      (item) =>
        (item.name || item.title || "").toLowerCase().includes(q) ||
        (item.category?.name || item.type || "").toLowerCase().includes(q) ||
        (item.location || "").toLowerCase().includes(q)
    );
  }, [searchTerm, apiPosts]);

  // Logika Kategori Spesifik
  const categoryItems = useMemo(() => {
    if (!selectedCategory) return [];
    const items = apiPosts.filter((item) => item.categoryId === selectedCategory);
    if (!searchTerm.trim()) return items;
    
    const q = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        (item.name || item.title || "").toLowerCase().includes(q) ||
        (item.location || "").toLowerCase().includes(q)
    );
  }, [selectedCategory, searchTerm, apiPosts]);

  const selectedCategoryData = useMemo(() => {
    if (!selectedCategory) return null;
    return apiCategories.find((cat) => cat.id === selectedCategory) || null;
  }, [selectedCategory, apiCategories]);

  // Slider Animasi
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.profile-dropdown-container')) {
        setShowProfileDropdown(false);
      }
    };
    if (showProfileDropdown) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileDropdown]);

  const handleLogout = async () => {
    if (!token) { onLogout(); return; }
    try { await logout(); } catch {}
    onLogout();
  };

  const handleProfileClick = () => setShowProfileDropdown(!showProfileDropdown);
  const handleMyOrdersClick = () => { setShowProfileDropdown(false); onMyOrders?.(); };
  const handleMyPostClick = () => { setShowProfileDropdown(false); onMyPost?.(); };
  const handleViewDetails = (item: NearbyItem) => onViewDetails(item);

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

          <button className="navbar-cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </button>

          {token ? (
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
          ) : (
            <>
              <button className="btn-outline">Login</button>
              <button className="btn-primary">Register</button>
            </>
          )}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {loadingData ? (
          <div className="empty-state">
            <p>Memuat data Dashboard...</p>
          </div>
        ) : selectedCategory && selectedCategoryData ? (
          <>
            <div className="cat-header">
              <button className="back-btn" onClick={handleCategoryBack}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Back
              </button>
              <h2 className="cat-title">{selectedCategoryData.label}</h2>
            </div>

            {categoryItems.length > 0 ? (
              <div className="cards-grid">
                {categoryItems.map((item) => (
                  <ItemCard key={item.id} item={item} onViewDetails={handleViewDetails} />
                ))}
              </div>
            ) : (
              <div className="cards-grid">
                <div className="empty-state">Tidak ada barang ditemukan di kategori ini.</div>
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
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <button key={cat.id} className="category-item" onClick={() => handleCategorySelect(cat.id)}>
                    <div className="category-circle" style={{ color: "#1a8c7a" }}>
                      {cat.iconComponent}
                    </div>
                    <span className="category-label">{cat.label}</span>
                  </button>
                ))
              ) : (
                <div className="empty-state">Kategori sedang dimuat...</div>
              )}
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
                <div className="empty-state">Belum ada barang di sekitar kamu.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}