import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { auth } from "../app/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const API_URL = API_ENDPOINTS.USERS;

interface User {
  id: string;
  email: string | null;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // User is signed in, fetch user data from database
          const response = await axios.get(`${API_URL}/${firebaseUser.uid}`);
          const userFromDb = response.data;
          setUser(userFromDb);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          // If user doesn't exist in database, create a basic user object
          const userData: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            role: "user",
          };
          setUser(userData);
          setIsAuthenticated(true);
        }
      } else {
        // User is signed out
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const userData: User = {
      id: user.uid,
      email: user.email,
      role: "user",
    };
    await axios.post(API_URL, userData);
    // State will be updated automatically by onAuthStateChanged listener
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // State will be updated automatically by onAuthStateChanged listener
  };

  const logout = async () => {
    await signOut(auth);
    // State will be updated automatically by onAuthStateChanged listener
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
