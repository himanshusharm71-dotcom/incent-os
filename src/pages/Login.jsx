import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Mail, Lock, User, Shield } from 'lucide-react';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, requestAccess } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingMsg, setPendingMsg] = useState('');

  // Secret Invite System: Only show registration if ?invite=true is in URL
  const searchParams = new URLSearchParams(window.location.search);
  const isInvited = searchParams.get('invite') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPendingMsg('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        navigate('/');
      } else {
        const teamPref = document.getElementById('teamPref').value;
        await requestAccess(email, password, name, teamPref);
        setPendingMsg(`✅ Request sent! Your account will be activated once the Chair approves your request.`);
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
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
      
      {/* Background Decorative Elements */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: 'var(--accent-primary)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1, zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px', background: 'var(--accent-secondary)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1, zIndex: 0 }}></div>

      <Card style={{ 
        width: '100%', 
        maxWidth: '440px', 
        zIndex: 1, 
        padding: '3rem 2.5rem',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05) inset'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #F97316, #EA580C)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.8rem',
            color: '#fff',
            margin: '0 auto 1.5rem',
            boxShadow: '0 10px 25px -5px rgba(249, 115, 22, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>I</div>
          <Badge variant="primary" style={{ marginBottom: '10px' }}>Private Operating System</Badge>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 0.5rem 0', background: 'linear-gradient(to right, #0F172A, #334155)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
            INCENT OS
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Restricted Team Portal. Please sign in to continue.
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--status-danger)', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {pendingMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', padding: '12px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center', border: '1px solid rgba(16,185,129,0.25)' }}>
            {pendingMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(!isLogin && isInvited) && (
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px' }} />
              <input 
                type="text" 
                placeholder="Full Name" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', paddingLeft: '40px', boxSizing: 'border-box' }}
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px' }} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', paddingLeft: '40px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px' }} />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', paddingLeft: '40px', boxSizing: 'border-box' }}
            />
          </div>

          {(!isLogin && isInvited) && (
            <div style={{ position: 'relative' }}>
              <Shield size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px' }} />
              <select id="teamPref" style={{ width: '100%', paddingLeft: '40px', boxSizing: 'border-box', appearance: 'none', background: 'rgba(255,255,255,0.9)', color: 'var(--text-primary)' }} required defaultValue="">
                <option value="" disabled>Select Team Preference</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Event Management">Event Management</option>
                <option value="Startup & Innovation">Startup & Innovation</option>
                <option value="Corporate Relations">Corporate Relations</option>
                <option value="Public Relations">Public Relations</option>
                <option value="Social Media & Branding">Social Media & Branding</option>
              </select>
            </div>
          )}

          <Button type="submit" variant="primary" style={{ marginTop: '1rem', width: '100%', padding: '14px', fontSize: '1.05rem', fontWeight: '600', letterSpacing: '0.5px', boxShadow: '0 10px 20px -10px rgba(249, 115, 22, 0.5)' }} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In to Portal' : 'Submit Join Request')}
          </Button>
          
          {isInvited && (
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.85rem', cursor: 'pointer', marginTop: '10px' }}
            >
              {isLogin ? "Don't have an account? Request Access" : "Already have an account? Login"}
            </button>
          )}
        </form>

        {isLogin && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <a href="#" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }}>Forgot your password?</a>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Login;