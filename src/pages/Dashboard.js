import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const properties = [
  { id: 1, title: 'Modern Apartment', location: 'Chennai, Tamil Nadu', price: '₹45,00,000', type: 'Apartment', beds: 2, baths: 2, sqft: '1,200 sqft', status: 'For Sale', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=200&fit=crop' },
  { id: 2, title: 'Independent Villa', location: 'Coimbatore, Tamil Nadu', price: '₹85,00,000', type: 'Villa', beds: 4, baths: 3, sqft: '2,800 sqft', status: 'For Sale', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=200&fit=crop' },
  { id: 3, title: 'Commercial Office Space', location: 'Tiruppur, Tamil Nadu', price: '₹25,000 / month', type: 'Commercial', beds: 0, baths: 2, sqft: '900 sqft', status: 'For Rent', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop' },
  { id: 4, title: 'Budget Studio Flat', location: 'Madurai, Tamil Nadu', price: '₹18,00,000', type: 'Apartment', beds: 1, baths: 1, sqft: '650 sqft', status: 'For Sale', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=200&fit=crop' },
  { id: 5, title: 'Luxury Penthouse', location: 'Chennai, Tamil Nadu', price: '₹2,10,00,000', type: 'Penthouse', beds: 5, baths: 4, sqft: '4,500 sqft', status: 'For Sale', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=200&fit=crop' },
  { id: 6, title: 'Cozy 2BHK Flat', location: 'Salem, Tamil Nadu', price: '₹12,000 / month', type: 'Apartment', beds: 2, baths: 1, sqft: '950 sqft', status: 'For Rent', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=200&fit=crop' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('properties');
  const [savedIds, setSavedIds] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [myProperties, setMyProperties] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: '',
    location: '',
    price: '',
    property_type: 'Apartment',
    status: 'For Sale',
    beds: 0,
    baths: 1,
    sqft: '',
    image_url: ''
  });

  const fetchSaved = async () => {
    try {
      const res = await API.get('/saved-properties/');
      setSavedProperties(res.data.saved_properties);
      setSavedIds(res.data.saved_properties.map(p => p.property_id));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMyProperties = async () => {
    try {
      const res = await API.get('/user-properties/');
      setMyProperties(res.data.properties);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/user-dashboard/');
        if (res.data.role === 'admin') {
          navigate('/admin-dashboard');
          return;
        }
        setUser(res.data.profile);
      } catch (err) {
        localStorage.clear();
        navigate('/login');
      }
    };
    fetchUser();
    fetchSaved();
    fetchMyProperties();
  }, [navigate]);

  const handleSave = async (property) => {
    try {
      if (savedIds.includes(property.id)) {
        await API.delete('/save-property/', {
          data: { property_id: property.id }
        });
        setSavedIds(savedIds.filter(id => id !== property.id));
        setSavedProperties(savedProperties.filter(p => p.property_id !== property.id));
      } else {
        await API.post('/save-property/', {
          property_id: property.id,
          title: property.title,
          location: property.location,
          price: property.price,
          status: property.status,
          image: property.image
        });
        setSavedIds([...savedIds, property.id]);
        setSavedProperties([...savedProperties, { ...property, property_id: property.id }]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    try {
      await API.post('/user-properties/', newProperty);
      setShowAddForm(false);
      setNewProperty({
        title: '', location: '', price: '',
        property_type: 'Apartment', status: 'For Sale',
        beds: 0, baths: 1, sqft: '', image_url: ''
      });
      fetchMyProperties();
      alert('Property added successfully!');
    } catch (err) {
      alert('Failed to add property. Please fill all fields.');
    }
  };

  const handleDeleteMyProperty = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await API.delete('/user-properties/', { data: { id } });
        fetchMyProperties();
      } catch (err) {
        alert('Failed to delete property');
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const filtered = filter === 'All' ? properties : properties.filter(p => p.status === filter);

  if (!user) return <p style={{ textAlign: 'center', marginTop: '60px' }}>Loading...</p>;

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.brand}>🏠 PropFinder</h2>
        <div style={styles.userInfo}>
          <span style={styles.welcomeText}>Hello, {user.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Find Your Dream Property</h1>
        <p style={styles.heroSub}>Browse verified listings across Tamil Nadu</p>
      </div>

      {/* Tabs */}
      <div style={styles.tabRow}>
        <button
          style={activeTab === 'properties' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('properties')}
        >
          🏠 All Properties
        </button>
        <button
          style={activeTab === 'saved' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('saved')}
        >
          ❤️ Saved ({savedIds.length})
        </button>
        <button
          style={activeTab === 'myproperties' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('myproperties')}
        >
          🏡 My Properties ({myProperties.length})
        </button>
      </div>

      {/* All Properties Tab */}
      {activeTab === 'properties' && (
        <>
          <div style={styles.filterRow}>
            {['All', 'For Sale', 'For Rent'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={filter === f ? styles.filterActive : styles.filterBtn}
              >
                {f}
              </button>
            ))}
          </div>
          <div style={styles.grid}>
            {filtered.map(property => (
              <div key={property.id} style={styles.card}>
                <div style={styles.imageWrapper}>
                  <img src={property.image} alt={property.title} style={styles.image} />
                  <div style={styles.imageBadges}>
                    <span style={styles.propertyType}>{property.type}</span>
                    <span style={{ ...styles.statusBadge, backgroundColor: property.status === 'For Sale' ? '#4f46e5' : '#10b981' }}>
                      {property.status}
                    </span>
                  </div>
                  <button
                    style={{ ...styles.saveBtn, backgroundColor: savedIds.includes(property.id) ? '#ef4444' : 'rgba(0,0,0,0.4)' }}
                    onClick={() => handleSave(property)}
                  >
                    {savedIds.includes(property.id) ? '❤️' : '🤍'}
                  </button>
                </div>
                <div style={styles.cardBody}>
                  <h3 style={styles.propertyTitle}>{property.title}</h3>
                  <p style={styles.location}>📍 {property.location}</p>
                  <div style={styles.detailsRow}>
                    {property.beds > 0 && <span style={styles.detail}>🛏 {property.beds} Beds</span>}
                    <span style={styles.detail}>🚿 {property.baths} Baths</span>
                    <span style={styles.detail}>📐 {property.sqft}</span>
                  </div>
                  <div style={styles.cardFooter}>
                    <span style={styles.price}>{property.price}</span>
                    <button style={styles.viewBtn}>View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Saved Properties Tab */}
      {activeTab === 'saved' && (
        <div style={styles.savedSection}>
          {savedProperties.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>🤍 No saved properties yet</p>
              <p style={styles.emptySubText}>Click the heart icon on any property to save it</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {savedProperties.map(property => (
                <div key={property.property_id} style={styles.card}>
                  <div style={styles.imageWrapper}>
                    <img src={property.image} alt={property.title} style={styles.image} />
                    <div style={styles.imageBadges}>
                      <span style={{ ...styles.statusBadge, backgroundColor: property.status === 'For Sale' ? '#4f46e5' : '#10b981' }}>
                        {property.status}
                      </span>
                    </div>
                    <button
                      style={{ ...styles.saveBtn, backgroundColor: '#ef4444' }}
                      onClick={() => handleSave({ id: property.property_id, ...property })}
                    >
                      ❤️
                    </button>
                  </div>
                  <div style={styles.cardBody}>
                    <h3 style={styles.propertyTitle}>{property.title}</h3>
                    <p style={styles.location}>📍 {property.location}</p>
                    <div style={styles.cardFooter}>
                      <span style={styles.price}>{property.price}</span>
                      <button style={styles.viewBtn}>View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Properties Tab */}
      {activeTab === 'myproperties' && (
        <div style={styles.savedSection}>

          {/* Add Property Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button
              style={styles.addPropertyBtn}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? '✕ Cancel' : '+ Add Property'}
            </button>
          </div>

          {/* Add Property Form */}
          {showAddForm && (
            <div style={styles.formCard}>
              <h3 style={{ margin: '0 0 20px', color: '#1f2937' }}>Add New Property</h3>
              <div style={styles.formGrid}>
                <input
                  style={styles.formInput}
                  placeholder="Title"
                  value={newProperty.title}
                  onChange={e => setNewProperty({ ...newProperty, title: e.target.value })}
                />
                <input
                  style={styles.formInput}
                  placeholder="Location"
                  value={newProperty.location}
                  onChange={e => setNewProperty({ ...newProperty, location: e.target.value })}
                />
                <input
                  style={styles.formInput}
                  placeholder="Price (e.g. ₹45,00,000)"
                  value={newProperty.price}
                  onChange={e => setNewProperty({ ...newProperty, price: e.target.value })}
                />
                <input
                  style={styles.formInput}
                  placeholder="Size (e.g. 1200 sqft)"
                  value={newProperty.sqft}
                  onChange={e => setNewProperty({ ...newProperty, sqft: e.target.value })}
                />
                <input
                  style={styles.formInput}
                  type="number"
                  placeholder="Beds"
                  value={newProperty.beds}
                  onChange={e => setNewProperty({ ...newProperty, beds: e.target.value })}
                />
                <input
                  style={styles.formInput}
                  type="number"
                  placeholder="Baths"
                  value={newProperty.baths}
                  onChange={e => setNewProperty({ ...newProperty, baths: e.target.value })}
                />
                <select
                  style={styles.formInput}
                  value={newProperty.property_type}
                  onChange={e => setNewProperty({ ...newProperty, property_type: e.target.value })}
                >
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Commercial</option>
                  <option>Penthouse</option>
                  <option>Plot</option>
                </select>
                <select
                  style={styles.formInput}
                  value={newProperty.status}
                  onChange={e => setNewProperty({ ...newProperty, status: e.target.value })}
                >
                  <option>For Sale</option>
                  <option>For Rent</option>
                </select>
                <input
                  style={{ ...styles.formInput, gridColumn: '1 / -1' }}
                  placeholder="Image URL (optional)"
                  value={newProperty.image_url}
                  onChange={e => setNewProperty({ ...newProperty, image_url: e.target.value })}
                />
              </div>
              <button style={styles.submitBtn} onClick={handleAddProperty}>
                Submit Property
              </button>
            </div>
          )}

          {/* My Properties List */}
          {myProperties.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>🏡 No properties added yet</p>
              <p style={styles.emptySubText}>Click Add Property to list your property</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {myProperties.map(property => (
                <div key={property.id} style={styles.card}>
                  <div style={styles.imageWrapper}>
                    <img
                      src={property.image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=200&fit=crop'}
                      alt={property.title}
                      style={styles.image}
                    />
                    <div style={styles.imageBadges}>
                      <span style={styles.propertyType}>{property.property_type}</span>
                      <span style={{ ...styles.statusBadge, backgroundColor: property.status === 'For Sale' ? '#4f46e5' : '#10b981' }}>
                        {property.status}
                      </span>
                    </div>
                  </div>
                  <div style={styles.cardBody}>
                    <h3 style={styles.propertyTitle}>{property.title}</h3>
                    <p style={styles.location}>📍 {property.location}</p>
                    <div style={styles.detailsRow}>
                      {property.beds > 0 && <span style={styles.detail}>🛏 {property.beds} Beds</span>}
                      <span style={styles.detail}>🚿 {property.baths} Baths</span>
                      <span style={styles.detail}>📐 {property.sqft}</span>
                    </div>
                    <div style={styles.cardFooter}>
                      <span style={styles.price}>{property.price}</span>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDeleteMyProperty(property.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <p>© 2025 PropFinder. Logged in as {user.email}</p>
      </div>

    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'sans-serif' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '16px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  brand: { margin: 0, color: '#4f46e5', fontSize: '22px' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '16px' },
  welcomeText: { fontSize: '14px', color: '#555' },
  logoutBtn: { padding: '8px 16px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  hero: { backgroundColor: '#4f46e5', padding: '48px 32px', textAlign: 'center' },
  heroTitle: { color: '#fff', fontSize: '32px', margin: '0 0 8px 0' },
  heroSub: { color: '#c7d2fe', fontSize: '16px', margin: 0 },
  tabRow: { display: 'flex', gap: '12px', padding: '24px 32px 8px' },
  tab: { padding: '10px 24px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#555' },
  tabActive: { padding: '10px 24px', backgroundColor: '#4f46e5', border: '1px solid #4f46e5', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#fff', fontWeight: 'bold' },
  filterRow: { display: 'flex', gap: '12px', padding: '8px 32px' },
  filterBtn: { padding: '8px 20px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '20px', cursor: 'pointer', fontSize: '14px', color: '#555' },
  filterActive: { padding: '8px 20px', backgroundColor: '#4f46e5', border: '1px solid #4f46e5', borderRadius: '20px', cursor: 'pointer', fontSize: '14px', color: '#fff', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', padding: '16px 32px 40px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  imageWrapper: { position: 'relative', height: '180px', overflow: 'hidden' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  imageBadges: { position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between' },
  propertyType: { backgroundColor: 'rgba(0,0,0,0.45)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' },
  statusBadge: { color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' },
  saveBtn: { position: 'absolute', bottom: '12px', right: '12px', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: '16px' },
  propertyTitle: { margin: '0 0 6px', fontSize: '16px', color: '#1f2937' },
  location: { fontSize: '13px', color: '#6b7280', margin: '0 0 12px' },
  detailsRow: { display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' },
  detail: { fontSize: '12px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '6px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: '16px', fontWeight: 'bold', color: '#4f46e5' },
  viewBtn: { padding: '8px 14px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  savedSection: { padding: '16px 32px 40px' },
  emptyState: { textAlign: 'center', padding: '60px 20px' },
  emptyText: { fontSize: '24px', color: '#9ca3af', margin: '0 0 8px' },
  emptySubText: { fontSize: '14px', color: '#9ca3af' },
  addPropertyBtn: { padding: '10px 20px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  formCard: { backgroundColor: '#fff', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' },
  formInput: { padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', width: '100%', boxSizing: 'border-box' },
  submitBtn: { padding: '12px 24px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  deleteBtn: { padding: '6px 14px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  footer: { textAlign: 'center', padding: '20px', color: '#9ca3af', fontSize: '13px', borderTop: '1px solid #e5e7eb' },
};

export default Dashboard;