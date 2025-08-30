"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data?: any; error: any }>;
  signUp: (email: string, password: string) => Promise<{ data?: any; error: any }>;
  signInWithGoogle: () => Promise<{ data?: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  resendConfirmation: (email: string) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to set session cookie
const setSessionCookie = (role: string, userId: string) => {
  const sessionData = JSON.stringify({ role, id: userId });
  document.cookie = `session=${encodeURIComponent(sessionData)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};

// Helper function to clear session cookie
const clearSessionCookie = () => {
  document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Set custom session cookie if we have a session
      if (session?.user) {
        // Determine role based on user metadata or email domain
        const role = session.user.user_metadata?.role || 'student';
        setSessionCookie(role, session.user.id);
      }

      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Update custom session cookie
        if (session?.user) {
          const role = session.user.user_metadata?.role || 'student';
          setSessionCookie(role, session.user.id);
        } else {
          clearSessionCookie();
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in with email:', email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Sign in error:', error);
    } else {
      console.log('Sign in successful:', data);
      // Set custom session cookie on successful login
      if (data?.session?.user) {
        const role = data.session.user.user_metadata?.role || 'student';
        console.log('Setting session cookie after successful sign in:', { role, userId: data.session.user.id });
        setSessionCookie(role, data.session.user.id);
      }
    }

    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    console.log('Attempting to sign up with email:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/lobby`,
        data: {
          role: 'student' // Set default role for students
        }
      },
    });

    if (error) {
      console.error('Sign up error:', error);
    } else {
      console.log('Sign up successful:', data);
      // Set custom session cookie on successful signup
      if (data?.session?.user) {
        console.log('Setting session cookie after successful sign up:', { role: 'student', userId: data.session.user.id });
        setSessionCookie('student', data.session.user.id);
      }
    }

    return { data, error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/lobby`, // Redirect after Google auth
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });

    // Note: For OAuth, the session cookie will be set in the onAuthStateChange listener
    // when the user returns from the OAuth provider

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    // Clear custom session cookie
    clearSessionCookie();

    return { error };
  };

  const resendConfirmation = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/lobby`,
      },
    });
    return { error };
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resendConfirmation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
