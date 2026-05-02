import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isFetching = false;

    // 1. Check for Master Bypass session first
    const masterSession = localStorage.getItem('incent_master_session');
    if (masterSession) {
      setUser(JSON.parse(masterSession));
      setLoading(false);
      return;
    }

    // 2. Normal Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !isFetching) {
        isFetching = true;
        fetchUserProfile(session.user.id, session.user.email).finally(() => isFetching = false);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && !isFetching) {
        isFetching = true;
        await fetchUserProfile(session.user.id, session.user.email);
        isFetching = false;
      } else if (!session?.user) {
        setUser(null);
        setLoading(false);
      }
    });

    return () => authListener?.subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (uid, email) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', uid)
        .single();

      if (data) {
        let finalData = data;
        
        // Auto-activate pre-authorized users
        if (data.status === 'pre_approved') {
          const { data: updated, error: updErr } = await supabase
            .from('users')
            .update({ status: 'active' })
            .eq('id', uid)
            .select()
            .single();
          if (!updErr && updated) finalData = updated;
        }

        setUser({ uid, email, ...finalData });
      } else {
        // User exists in Auth but not in DB (edge case)
        setUser({ uid, email, status: 'pending', pending: true });
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Master Credentials (Bypass Supabase)
  const MASTER_EMAIL = '2024cshimanshu16902@poornima.edu.in';
  const MASTER_PASS = 'himanshu9001';

  // Real login — uses Supabase Auth credentials only
  const login = async (email, password) => {
    // 1. Strict Master Bypass Check
    if (email === MASTER_EMAIL) {
      if (password === MASTER_PASS) {
        const masterUser = {
          uid: 'master-admin-001',
          email: MASTER_EMAIL,
          Name: 'Himanshu Sharma',
          role: 'super_admin',
          team: 'Core',
          status: 'active',
          points: 9999,
          isMaster: true
        };
        setUser(masterUser);
        localStorage.setItem('incent_master_session', JSON.stringify(masterUser));
        setLoading(false);
        return { user: masterUser };
      } else {
        // If it's the master email but wrong password, block it!
        throw new Error('Invalid credentials for Master Account.');
      }
    }

    // 2. Normal Supabase Auth (for other members)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  // Request access — creates real Supabase Auth account + pending DB row
  const requestAccess = async (email, password, name, teamPref) => {
    // 1. Create the Auth account with real email + password
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    if (data.user) {
      // 2. Add to users table with status=pending (awaiting admin approval)
      const { error: dbError } = await supabase.from('users').insert([{
        id: data.user.id,
        Name: name,
        email: email,
        role: 'pending',
        team: teamPref,
        status: 'pending',
        points: 0,
      }]);
      if (dbError) throw dbError;
    }

    // Sign them back out immediately — they must wait for admin approval
    await supabase.auth.signOut();
    return data;
  };

  const logout = async () => {
    localStorage.removeItem('incent_master_session');
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, requestAccess }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;