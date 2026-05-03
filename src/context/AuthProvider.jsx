import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initAuth = async () => {
      // Force loading to end after 5 seconds as a safety valve
      const forceEndLoading = setTimeout(() => {
        if (loading) {
          console.warn("Auth initialization taking too long, forcing load end...");
          setLoading(false);
        }
      }, 5000);

      try {
        const masterSession = localStorage.getItem('incent_master_session');
        
        // Check for active session with a strict timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Auth Timeout")), 3500)
        );

        try {
          const result = await Promise.race([sessionPromise, timeoutPromise]);
          const session = result?.data?.session;

          if (session?.user) {
            localStorage.removeItem('incent_master_session');
            await fetchUserProfile(session.user.id, session.user.email);
          } else if (masterSession) {
            setUser(JSON.parse(masterSession));
          }
        } catch (e) {
          console.warn("Auth check failed/timed out, checking local cache...");
          if (masterSession) {
            try {
              setUser(JSON.parse(masterSession));
            } catch (jsonErr) {
              localStorage.removeItem('incent_master_session');
            }
          }
        }
      } catch (err) {
        console.error("Critical Auth error:", err);
      } finally {
        clearTimeout(forceEndLoading);
        setLoading(false);
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        localStorage.removeItem('incent_master_session');
        await fetchUserProfile(session.user.id, session.user.email);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('incent_master_session');
      }
    });

    return () => authListener?.subscription?.unsubscribe();
  }, []);

  const fetchUserProfile = async (uid, email) => {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', uid).single();
      if (error) throw error;
      if (data) {
        setUser({ uid, email, ...data });
      } else {
        // Fallback for authenticated users without a profile record
        setUser({ uid, email, Name: email.split('@')[0], role: 'member', team: 'General', status: 'active' });
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      // Don't leave user as null if they are authenticated
      setUser({ uid, email, role: 'member', status: 'active' });
    }
  };

  const login = async (email, password) => {
    const MASTER_EMAIL = '2024cshimanshu16902@poornima.edu.in';
    const MASTER_PASS = 'himanshu9001';

    if (email === MASTER_EMAIL && password === MASTER_PASS) {
      const masterUser = { uid: 'master-admin-001', email: MASTER_EMAIL, Name: 'Himanshu Sharma', role: 'super_admin', team: 'Core', status: 'active', isMaster: true };
      setUser(masterUser);
      localStorage.setItem('incent_master_session', JSON.stringify(masterUser));
      return { user: masterUser };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    localStorage.removeItem('incent_master_session');
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {loading ? (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', color: '#F97316' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid rgba(249,115,22,0.1)', borderTopColor: '#F97316', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '20px', fontWeight: '800', letterSpacing: '1px', fontSize: '0.75rem' }}>KERNEL BOOTING...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;