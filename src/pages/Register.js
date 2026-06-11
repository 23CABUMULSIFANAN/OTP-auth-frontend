import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '',
  });
  const [otp, setOtp] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/register/', formData);
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      const data = err.response?.data;
      // If user already exists but not verified — go to OTP step
      if (data?.email?.[0]?.includes('already registered') ||
          data?.email?.[0]?.includes('already exists')) {
        try {
          // Check if user is verified
          const checkRes = await API.post('/resend-otp/', { email: formData.email });
          setMessage(checkRes.data.message);
          setStep(2);
        } catch (resendErr) {
          const resendData = resendErr.response?.data;
          if (resendData?.redirect === 'login') {
            setError('This email is already registered and verified. Please login instead.');
          } else {
            setError(resendData?.error || 'Something went wrong. Try again.');
          }
        }
      } else if (data?.email) {
        setError(data.email[0]);
      } else if (data?.phone) {
        setError(data.phone[0]);
      } else if (data?.password) {
        setError(data.password[0]);
      } else {
        setError('Registration failed. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/resend-otp/', { email: formData.email });
      setMessage(res.data.message);
    } catch (err) {
      setError('Failed to resend OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/verify-otp/', {
        email: formData.email,
        otp_code: otp,
      });
      localStorage.setItem('access_token', res.data.tokens.access);
      localStorage.setItem('refresh_token', res.data.tokens.refresh);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {step === 1 ? 'Create Account' : 'Verify OTP'}
        </h2>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        {step === 1 ? (
          <form onSubmit={handleRegister}>
            <input style={styles.input} type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            <input style={styles.input} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input style={styles.input} type="text" name="phone" placeholder="Phone Number (10 digits)" value={formData.phone} onChange={handleChange} required />
            <input style={styles.input} type="password" name="password" placeholder="Password (minimum 6 characters)" value={formData.password} onChange={handleChange} required />
            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Register'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <p style={styles.hint}>
              OTP sent to <strong>{formData.email}</strong>
            </p>
            <p style={styles.spamNote}>
              ⚠️ Please check your <strong>spam/junk folder</strong> if you don't see it in inbox.
            </p>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              style={styles.resendBtn}
              onClick={handleResendOTP}
              disabled={loading}
            >
              {loading ? 'Sending...' : '🔄 Resend OTP'}
            </button>
          </form>
        )}

        <p style={styles.link}>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={styles.linkText}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' },
  card: { backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  title: { marginBottom: '24px', textAlign: 'center', color: '#333' },
  input: { width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginBottom: '8px' },
  resendBtn: { width: '100%', padding: '12px', backgroundColor: '#fff', color: '#4f46e5', border: '1px solid #4f46e5', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', marginTop: '4px' },
  error: { color: 'red', marginBottom: '12px', fontSize: '14px', padding: '8px', backgroundColor: '#fef2f2', borderRadius: '6px' },
  success: { color: 'green', marginBottom: '12px', fontSize: '14px', padding: '8px', backgroundColor: '#f0fdf4', borderRadius: '6px' },
  hint: { color: '#666', marginBottom: '8px', fontSize: '14px' },
  spamNote: { color: '#d97706', marginBottom: '12px', fontSize: '13px', padding: '8px', backgroundColor: '#fffbeb', borderRadius: '6px' },
  link: { marginTop: '16px', textAlign: 'center', fontSize: '14px', color: '#666' },
  linkText: { color: '#4f46e5', cursor: 'pointer', fontWeight: 'bold' },
};

export default Register;