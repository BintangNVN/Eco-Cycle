import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { NearbyItem } from "./ItemDetails";
import type { ReactNode } from "react";
import "../styles/css/dashboard.css";

// IMPORT API
import api, { getMyPosts, createPost, getCategories } from "../services/api/api"; 

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

interface ExtendNearbyItem extends Omit<NearbyItem, 'weight'> {
  id: string;
  name?: string;
  label?: string;
  poitRewards?: number | string;
  image?: string[]; 
  category?: { id: string; name: string };
  condition?: string;
  weight?: number | string;
  description?: string;
}

// === SVG ICONS ===
const PlasticIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 2h10l2 7H5l2-7z"/><rect x="5" y="9" width="14" height="11" rx="1"/><line x1="12" y1="9" x2="12" y2="20"/><circle cx="9" cy="15" r="0.5" fill="currentColor"/><circle cx="15" cy="15" r="0.5" fill="currentColor"/></svg>);
const GlassIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 3h12l-1 8c0 2-1 3-5 3s-5-1-5-3L6 3z"/><line x1="8" y1="14" x2="16" y2="14"/><path d="M7 14l-1 6c0 1 1 2 2 2h8c1 0 2-1 2-2l-1-6"/></svg>);
const TinIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="4" width="12" height="14" rx="1"/><line x1="6" y1="8" x2="18" y2="8"/><line x1="6" y1="12" x2="18" y2="12"/><path d="M9 2h6v2H9z"/><line x1="8" y1="19" x2="16" y2="19"/><line x1="9" y1="22" x2="15" y2="22"/></svg>);
const CardboardIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 3l18 18"/><path d="M21 3L3 21"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/></svg>);
const PatchworkIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/><line x1="3" y1="11" x2="21" y2="11"/><line x1="11" y1="3" x2="11" y2="21"/></svg>);
const PaperIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="1"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="15" y2="15"/></svg>);

const conditions = [
  { label: "Bekas Bagus", value: "good" },
  { label: "Baru", value: "new" },
  { label: "Bekas Rusak", value: "bad" }
];

const initialForm = { title: "", condition: "", categoryId: "", weight: "", points: "", description: "" };

function ItemCard({ item, onEdit, onDelete }: { item: ExtendNearbyItem; onEdit: (item: ExtendNearbyItem) => void; onDelete: (id: string) => void; }) {
  const displayTitle = item.name || item.label || item.title || "Untitled Product";
  const backendBaseUrl = "https://service-capstone-project-production.up.railway.app";
  let imageUrl = (item.image && item.image[0]) ? (item.image[0].startsWith("http") ? item.image[0] : `${backendBaseUrl}${item.image[0]}`) : "";

  return (
    <div className="item-card">
      <div className="card-img-wrap">
        {imageUrl ? <img src={imageUrl} alt={displayTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="card-img-placeholder">♻️</div>}
      </div>
      <div className="card-body">
        <div className="card-meta-top">
          <div className="card-location">{item.location || "Bogor"}</div>
          <span className="card-weight">{item.weight || "0"} kg</span>
        </div>
        <div className="card-title">{displayTitle}</div>
      </div>
      <div className="card-footer" style={{ gap: "8px" }}>
        <button className="btn-outline" style={{ flex: 1, padding: "8px" }} onClick={() => onEdit(item)}>Edit</button>
        <button className="btn-primary" style={{ flex: 1, padding: "8px", backgroundColor: "#dc3545", borderColor: "#dc3545" }} onClick={() => onDelete(item.id)}>Delete</button>
      </div>
    </div>
  );
}

export default function MyPost({ onBack }: MyPostProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [posts, setPosts] = useState<ExtendNearbyItem[]>([]);
  const [apiCategories, setApiCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState(initialForm);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchPosts = async () => {
    setPageLoading(true);
    try {
      const res = await getMyPosts();
      setPosts(res.data?.data?.posts || []);
    } catch (e) { console.error(e); }
    finally { setPageLoading(false); }
  };

  useEffect(() => {
    fetchPosts();
    getCategories().then(res => setApiCategories(res.data?.data || []));
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Hapus postingan ini?")) {
      try {
        await api.delete(`/post/${id}`);
        window.alert("Berhasil dihapus!");
        fetchPosts();
      } catch (error) { window.alert("Gagal menghapus."); }
    }
  };

  const handleEdit = (item: ExtendNearbyItem) => {
    setEditId(item.id);
    setFormData({
      title: item.name || item.title || "",
      condition: item.condition || "",
      categoryId: item.categoryId || "",
      weight: String(item.weight || ""),
      points: String(item.poitRewards || ""),
      description: item.description || ""
    });
    setShowCreatePost(true);
  };

  const handleCreatePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.title);
      submitData.append("label", formData.title);
      submitData.append("condition", formData.condition);
      submitData.append("categoryId", formData.categoryId); 
      submitData.append("weight", formData.weight);
      submitData.append("poitRewards", formData.points); 
      submitData.append("description", formData.description);
      
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => submitData.append("image", file));
      }

      if (editId) {
        submitData.append("_method", "PATCH");
        await api.post(`/post/${editId}`, submitData);
        window.alert("Postingan berhasil diperbarui!");
      } else {
        await createPost(submitData);
        window.alert("Postingan berhasil dibuat!");
      }

      setShowCreatePost(false);
      setEditId(null);
      setFormData(initialForm);
      setImageFiles([]);
      setImagePreviews([]);
      fetchPosts();
    } catch (error) { 
      window.alert("Gagal memproses postingan. Periksa koneksi atau data."); 
    } finally { setSubmitLoading(false); }
  };

  const filteredPosts = posts.filter(item => 
    (item.name || item.label || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="eco-app">
      <nav className="navbar">
        <div className="navbar-logo" onClick={onBack} style={{cursor: 'pointer'}}>EcoCycle</div>
        <div className="navbar-search">
          <input type="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search your posts..." />
        </div>
      </nav>

      {showCreatePost ? (
        <div className="main-content create-post-page">
          <div className="cat-header">
            <button className="back-btn" onClick={() => { setShowCreatePost(false); setEditId(null); setFormData(initialForm); setImagePreviews([]); }}>Back</button>
            <div className="section-title">{editId ? "Edit Post" : "Add New Post"}</div>
          </div>
          <form className="create-post-grid" onSubmit={handleCreatePost}>
            <div className="upload-panel">
              <div className="upload-dropzone">
                {imagePreviews.length > 0 ? (
                  <div className="upload-preview"><img src={imagePreviews[0]} alt="Preview" /></div>
                ) : (
                  <div className="upload-placeholder"><strong>{editId ? "Ubah Foto (Opsional)" : "Upload Photo"}</strong></div>
                )}
                <input className="upload-input" type="file" multiple onChange={(e) => {
                  const files = e.target.files ? Array.from(e.target.files).slice(0,3) : [];
                  setImageFiles(files);
                  setImagePreviews(files.map(f => URL.createObjectURL(f)));
                }} />
              </div>
            </div>
            <div className="create-post-form">
              <div className="form-group">
                <label>Product Name</label>
                <input className="form-input" type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-row-flex">
                <div className="form-group">
                  <label>Condition</label>
                  <select className="form-input" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} required>
                    <option value="">Select</option>
                    {conditions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-input" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} required>
                    <option value="">Select</option>
                    {apiCategories.map(c => <option key={c.id} value={c.id}>{c.name || c.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row-flex">
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input className="form-input" type="number" step="0.1" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Points Reward</label>
                  <input className="form-input" type="number" value={formData.points} onChange={e => setFormData({...formData, points: e.target.value})} required />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea className="form-textarea" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detail barang..." />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={submitLoading}>
                  {submitLoading ? "Processing..." : (editId ? "Save Changes" : "Send Post")}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="main-content">
          <div className="section-header">
            <div className="section-title">My Posts</div>
            <button className="view-all-btn" onClick={() => setShowCreatePost(true)}>Create Post +</button>
          </div>
          {pageLoading ? <p>Loading posts...</p> : (
            <div className="cards-grid">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(item => (
                  <ItemCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
                ))
              ) : (
                <div className="empty-state">Belum ada postingan.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}