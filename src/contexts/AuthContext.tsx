import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  privacyPolicyAccepted: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  acceptPrivacyPolicy: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data } = await supabase
          .from('user_profiles')
          .select('is_admin, privacy_policy_accepted_at')
          .eq('id', session.user.id)
          .maybeSingle();

        setIsAdmin(data?.is_admin ?? false);
        setPrivacyPolicyAccepted(!!data?.privacy_policy_accepted_at);
      } else {
        setIsAdmin(false);
        setPrivacyPolicyAccepted(false);
      }

      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data } = await supabase
            .from('user_profiles')
            .select('is_admin, privacy_policy_accepted_at')
            .eq('id', session.user.id)
            .maybeSingle();

          setIsAdmin(data?.is_admin ?? false);
          setPrivacyPolicyAccepted(!!data?.privacy_policy_accepted_at);
        } else {
          setIsAdmin(false);
          setPrivacyPolicyAccepted(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const acceptPrivacyPolicy = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('user_profiles')
      .update({ privacy_policy_accepted_at: new Date().toISOString() })
      .eq('id', user.id);

    if (!error) {
      setPrivacyPolicyAccepted(true);
    }
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    privacyPolicyAccepted,
    signUp,
    signIn,
    signOut,
    acceptPrivacyPolicy,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
