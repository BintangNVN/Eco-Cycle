import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { NearbyItem } from "./ItemDetails";
import type { ReactNode } from "react";
import "../styles/css/dashboard.css";

type MyPostProps = {
  onBack: () => void;
  onViewDetails: (item: NearbyItem) => void;
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

const categories: Category[] = [
  { id: "plastic", label: "Plastic", emoji: "🧴", icon: "🍶", iconComponent: <PlasticIcon /> },
  { id: "glass", label: "Glass", emoji: "🍾", icon: "🍾", iconComponent: <GlassIcon /> },
  { id: "tin", label: "Tin", emoji: "🥫", icon: "🥫", iconComponent: <TinIcon /> },
  { id: "cardboard", label: "Cardboard", emoji: "📦", icon: "📦", iconComponent: <CardboardIcon /> },
  { id: "patchwork", label: "Patchwork", emoji: "🧵", icon: "🧵", iconComponent: <PatchworkIcon /> },
  { id: "paper", label: "Paper", emoji: "📰", icon: "📰", iconComponent: <PaperIcon /> },
];

type PostForm = {
  title: string;
  condition: string;
  categoryId: string;
  weight: string;
  price: string;
  points: string;
  description: string;
};

const conditions = ["Baru", "Bekas Bagus", "Bekas Rusak"];

const initialForm: PostForm = {
  title: "",
  condition: "",
  categoryId: "",
  weight: "",
  price: "",
  points: "",
  description: "",
};

const userPosts: NearbyItem[] = [
  { id: "user-1", title: "My Plastic Bottles", type: "Plastic", categoryId: "plastic", location: "Jakarta Selatan", weight: "2kg", price: "Rp7.000", badge: "Available" },
  { id: "user-2", title: "Cardboard Boxes", type: "Cardboard", categoryId: "cardboard", location: "Jakarta Pusat", weight: "3kg", price: "Rp5.000", badge: "Cleaned" },
  { id: "user-3", title: "Glass Jars Collection", type: "Glass", categoryId: "glass", location: "Jakarta Timur", weight: "1.5kg", price: "Rp12.000", badge: "Available" },
];

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
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
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

export default function MyPost({ onBack, onViewDetails }: MyPostProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState<NearbyItem[]>(userPosts);
  const [formData, setFormData] = useState<PostForm>(initialForm);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const filteredPosts = posts.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (field: keyof PostForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? Array.from(event.target.files).slice(0, 3) : [];
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return previews;
    });
  };

  const handleCreatePost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.title || !formData.condition || !formData.categoryId || !formData.weight || !formData.price || !formData.points) {
      window.alert("Silakan isi semua bidang wajib terlebih dahulu.");
      return;
    }

    const newPost: NearbyItem = {
      id: `user-${Date.now()}`,
      title: formData.title,
      type: formData.condition,
      categoryId: formData.categoryId,
      location: "Bogor, Indonesia",
      weight: `${formData.weight} kg`,
      price: `Rp${formData.price.replace(/[^0-9]/g, ".")}`,
      badge: "Published",
    };

    setPosts((prev) => [newPost, ...prev]);
    setShowCreatePost(false);
    setFormData(initialForm);
    setImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });
    window.alert("Postingan berhasil dibuat.");
  };

  const renderCreatePostPage = () => (
    <div className="main-content create-post-page">
      <div className="cat-header">
        <button className="back-btn" type="button" onClick={() => setShowCreatePost(false)}>
          <span>Back</span>
        </button>
        <div>
          <div className="section-title">Add Post</div>
          <p className="section-subtitle">Tambah produk baru dengan foto dan informasi lengkap.</p>
        </div>
      </div>

      <form className="create-post-grid" onSubmit={handleCreatePost}>
        <div className="upload-panel">
          <div className="upload-dropzone">
            {imagePreviews.length === 0 ? (
              <div className="upload-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1a8c7a" strokeWidth="1.8">
                  <path d="M12 16v-8" />
                  <path d="M8 12l4-4 4 4" />
                  <path d="M4 20h16" />
                </svg>
                <div className="upload-text">
                  <strong>Upload Photo</strong>
                  <span>Drag and drop or click to upload high-quality photos of your item.</span>
                </div>
              </div>
            ) : (
              <div className="upload-preview">
                <img src={imagePreviews[0]} alt="Preview utama" />
              </div>
            )}
            <input
              className="upload-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>

          <div className="upload-thumbnails">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="thumbnail">
                {imagePreviews[index] ? <img src={imagePreviews[index]} alt={`Foto ${index + 1}`} /> : <span>+</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="create-post-form">
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input
              className="form-input"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Placeholder"
            />
          </div>

          <div className="form-row-flex">
            <div className="form-group">
              <label className="form-label">Condition</label>
              <select
                className="form-input"
                value={formData.condition}
                onChange={(e) => handleInputChange("condition", e.target.value)}
              >
                <option value="">Select Option</option>
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={formData.categoryId}
                onChange={(e) => handleInputChange("categoryId", e.target.value)}
              >
                <option value="">Select Option</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row-flex small-gaps">
            <div className="form-group">
              <label className="form-label">Weight</label>
              <input
                className="form-input"
                type="number"
                min="0"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                placeholder="Placeholder"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price</label>
              <div className="input-with-prefix">
                <span>Rp</span>
                <input
                  className="form-input form-input-prefix"
                  type="text"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="Placeholder"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Point Reward</label>
              <div className="input-with-suffix">
                <input
                  className="form-input form-input-suffix"
                  type="number"
                  min="0"
                  value={formData.points}
                  onChange={(e) => handleInputChange("points", e.target.value)}
                  placeholder="Placeholder"
                />
                <span>coins</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Placeholder"
              rows={6}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={() => setShowCreatePost(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Send Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <div className="eco-app">
      <nav className="navbar">
        <div className="navbar-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a8c7a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <polyline points="23 20 23 14 17 14" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
          EcoCycle
        </div>

        <div className="navbar-search">
          <svg className="navbar-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your posts..."
          />
        </div>

        <div className="navbar-right">
          <div className="navbar-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a8c7a" strokeWidth="2.2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Bogor, Indonesia
          </div>

          <button className="navbar-cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>

          <img src="https://i.pravatar.cc/72" alt="Avatar" className="navbar-avatar" />
        </div>
      </nav>

      {showCreatePost ? (
        renderCreatePostPage()
      ) : (
        <div className="main-content">
          <div className="section-header">
            <div className="section-title">My Posts</div>
            <button className="view-all-btn" type="button" onClick={() => setShowCreatePost(true)}>
              Create Post
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="cards-grid">
              {filteredPosts.map((item) => (
                <ItemCard key={item.id} item={item} onViewDetails={onViewDetails} />
              ))}
            </div>
          ) : (
            <div className="cards-grid">
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>No posts yet</h3>
                <p>Create your first post to start sharing recyclable materials with the community.</p>
                <button className="btn-primary" type="button" onClick={() => setShowCreatePost(true)} style={{ marginTop: "16px" }}>
                  Create Your First Post
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
