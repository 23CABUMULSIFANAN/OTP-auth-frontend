import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const properties = [
  {
    id: 1,
    title: 'Modern Apartment',
    location: 'Chennai, Tamil Nadu',
    price: '₹45,00,000',
    type: 'Apartment',
    beds: 2,
    baths: 2,
    sqft: '1,200 sqft',
    status: 'For Sale',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=200&fit=crop',
  },
  {
    id: 2,
    title: 'Independent Villa',
    location: 'Coimbatore, Tamil Nadu',
    price: '₹85,00,000',
    type: 'Villa',
    beds: 4,
    baths: 3,
    sqft: '2,800 sqft',
    status: 'For Sale',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=200&fit=crop',
  },
  {
    id: 3,
    title: 'Commercial Office Space',
    location: 'Tiruppur, Tamil Nadu',
    price: '₹25,000 / month',
    type: 'Commercial',
    beds: 0,
    baths: 2,
    sqft: '900 sqft',
    status: 'For Rent',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop',
  },
  {
    id: 4,
    title: 'Budget Studio Flat',
    location: 'Madurai, Tamil Nadu',
    price: '₹18,00,000',
    type: 'Apartment',
    beds: 1,
    baths: 1,
    sqft: '650 sqft',
    status: 'For Sale',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=200&fit=crop',
  },
  {
    id: 5,
    title: 'Luxury Penthouse',
    location: 'Chennai, Tamil Nadu',
    price: '₹2,10,00,000',
    type: 'Penthouse',
    beds: 5,
    baths: 4,
    sqft: '4,500 sqft',
    status: 'For Sale',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=200&fit=crop',
  },
  {
    id: 6,
    title: 'Cozy 2BHK Flat',
    location: 'Salem, Tamil Nadu',
    price: '₹12,000 / month',
    type: 'Apartment',
    beds: 2,
    baths: 1,
    sqft: '950 sqft',
    status: 'For Rent',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=200&fit=crop',
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('All');

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
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
    }
  };
  fetchUser();
}, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const filtered =
    filter === 'All'
      ? properties
      : properties.filter((p) => p.status === filter);

  if (!user)
    return (
      <p style={{ textAlign: 'center', marginTop: '60px' }}>Loading...</p>
    );

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.brand}>🏠 PropFinder</h2>
        <div style={styles.userInfo}>
          <span style={styles.welcomeText}>Hello, {user.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Find Your Dream Property</h1>
        <p style={styles.heroSub}>
          Browse verified listings across Tamil Nadu
        </p>
      </div>

      {/* Filter Buttons */}
      <div style={styles.filterRow}>
        {['All', 'For Sale', 'For Rent'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={filter === f ? styles.filterActive : styles.filterBtn}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Property Cards */}
      <div style={styles.grid}>
        {filtered.map((property) => (
          <div key={property.id} style={styles.card}>

            {/* Image with badges */}
            <div style={styles.imageWrapper}>
              <img
                src={property.image}
                alt={property.title}
                style={styles.image}
              />
              <div style={styles.imageBadges}>
                <span style={styles.propertyType}>{property.type}</span>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor:
                      property.status === 'For Sale' ? '#4f46e5' : '#10b981',
                  }}
                >
                  {property.status}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div style={styles.cardBody}>
              <h3 style={styles.propertyTitle}>{property.title}</h3>
              <p style={styles.location}>📍 {property.location}</p>

              <div style={styles.detailsRow}>
                {property.beds > 0 && (
                  <span style={styles.detail}>🛏 {property.beds} Beds</span>
                )}
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

      {/* Footer */}
      <div style={styles.footer}>
        <p>© 2025 PropFinder. Logged in as {user.email}</p>
      </div>

    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f4f6f9',
    fontFamily: 'sans-serif',
  },

  // Navbar
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '16px 32px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  brand: { margin: 0, color: '#4f46e5', fontSize: '22px' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '16px' },
  welcomeText: { fontSize: '14px', color: '#555' },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },

  // Hero
  hero: {
    backgroundColor: '#4f46e5',
    padding: '48px 32px',
    textAlign: 'center',
  },
  heroTitle: { color: '#fff', fontSize: '32px', margin: '0 0 8px 0' },
  heroSub: { color: '#c7d2fe', fontSize: '16px', margin: 0 },

  // Filter
  filterRow: {
    display: 'flex',
    gap: '12px',
    padding: '24px 32px 8px',
  },
  filterBtn: {
    padding: '8px 20px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#555',
  },
  filterActive: {
    padding: '8px 20px',
    backgroundColor: '#4f46e5',
    border: '1px solid #4f46e5',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#fff',
    fontWeight: 'bold',
  },

  // Grid
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
    padding: '16px 32px 40px',
  },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },

  // Image
  imageWrapper: {
    position: 'relative',
    height: '180px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageBadges: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    right: '12px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  propertyType: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
  },
  statusBadge: {
    color: '#fff',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
  },

  // Card body
  cardBody: { padding: '16px' },
  propertyTitle: { margin: '0 0 6px', fontSize: '16px', color: '#1f2937' },
  location: { fontSize: '13px', color: '#6b7280', margin: '0 0 12px' },
  detailsRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  detail: {
    fontSize: '12px',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: { fontSize: '16px', fontWeight: 'bold', color: '#4f46e5' },
  viewBtn: {
    padding: '8px 14px',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
  },

  // Footer
  footer: {
    textAlign: 'center',
    padding: '20px',
    color: '#9ca3af',
    fontSize: '13px',
    borderTop: '1px solid #e5e7eb',
  },
};

export default Dashboard;