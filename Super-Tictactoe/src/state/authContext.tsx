import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";

// User profile type
export type UserDB = {
  userId: string;
  email: string;
  username: string;
  avatar?: string;
};

// Auth context type
export type AuthContextType = {
  user: UserDB | null | undefined;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);
export const useUser = () => useContext(AuthContext).user;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserDB | null | undefined>(undefined);

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    setUser(undefined);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, username")
      .eq("id", userId)
      .single();
    if (error || !data) {
      setUser(null);
    } else {
      setUser({
        userId: data.id,
        email: data.email,
        username: data.username,
      });
    }
  };

  // Login with Supabase
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user) throw error || new Error("Login failed");
    await fetchUserProfile(data.user.id);
  };

  // Signup with Supabase
  const signup = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error || !data.user) throw error || new Error("Signup failed");

    // Insert profile with retry logic
    let retries = 3;
    let profileError;

    while (retries > 0) {
      const { error } = await supabase.from("profiles").insert([
        {
          id: data.user.id,
          email,
          username,
        },
      ]);

      if (!error) {
        profileError = null;
        break;
      }

      profileError = error;
      retries--;

      // Wait before retry
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    if (profileError) throw profileError;
    await fetchUserProfile(data.user.id);
  };

  // Logout with Supabase
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Listen for auth state changes
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setUser(null);
        }
      }
    );
    // On mount, check for existing session
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    })();
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = { user, login, signup, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
