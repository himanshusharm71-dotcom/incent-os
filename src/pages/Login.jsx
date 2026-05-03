import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Mail, Lock, AlertCircle, Info } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('invalid login') || msg.toLowerCase().includes('invalid credentials')) {
        setError('Wrong email or password. Please check and try again.');
      } else if (msg.toLowerCase().includes('email not confirmed')) {
        setError('Your email is not confirmed yet. Ask the Admin to disable email confirmation in Supabase, or check your inbox for a confirmation email.');
      } else if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(msg || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 50%, #F8FAFC 0%, #F1F5F9 100%)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }} className="animate-fade-in">
      
      {/* Background */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: 'var(--accent-primary)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1, zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px', background: 'var(--accent-secondary)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1, zIndex: 0 }}></div>

      <Card style={{ 
        width: '100%', 
        maxWidth: '420px', 
        zIndex: 1, 
        padding: '3rem 2.5rem',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #F97316, #EA580C)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.8rem',
            color: '#fff',
            margin: '0 auto 1.25rem',
            boxShadow: '0 10px 25px -5px rgba(249, 115, 22, 0.5)',
          }}>I</div>
          <Badge variant="primary" style={{ marginBottom: '8px' }}>Private Operating System</Badge>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0.5rem 0', color: '#0F172A', letterSpacing: '-0.5px' }}>
            INCENT OS
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Enter your credentials to access the portal.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.08)', 
            color: '#DC2626', 
            padding: '12px 14px', 
            borderRadius: '10px', 
            marginBottom: '1.25rem', 
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            border: '1px solid rgba(239,68,68,0.2)'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px', pointerEvents: 'none' }} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', paddingLeft: '40px', boxSizing: 'border-box' }}
              autoComplete="email"
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px', pointerEvents: 'none' }} />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', paddingLeft: '40px', boxSizing: 'border-box' }}
              autoComplete="current-password"
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading}
            style={{ marginTop: '0.5rem', width: '100%', padding: '14px', fontSize: '1rem', fontWeight: '600', boxShadow: '0 10px 20px -10px rgba(249, 115, 22, 0.5)' }}
          >
            {loading ? 'Signing in...' : 'Sign In to Portal'}
          </Button>
        </form>

        {/* Info box */}
        <div style={{ marginTop: '1.5rem', padding: '12px', background: 'rgba(99,102,241,0.05)', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.15)' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <Info size={14} color="#6366F1" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#4338CA', lineHeight: '1.5' }}>
              Access is granted by the Chair. Contact your admin if you cannot login.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Login;