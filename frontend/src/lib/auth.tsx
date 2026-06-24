import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "./api";

interface AuthContextValue {
  token: string | null;
  email: string | null;
  credits: number;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<{ verificationRequired: boolean }>;
  logout: () => void;
  setCredits: (n: number) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("bp_token"));
  const [email, setEmail] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(() => !!localStorage.getItem("bp_token"));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then((user) => {
        setEmail(user.email);
        setCredits(user.credits);
      })
      .catch(() => {
        localStorage.removeItem("bp_token");
        setToken(null);
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (emailInput: string, password: string) => {
    const { token: t, credits: c } = await api.login(emailInput, password);
    localStorage.setItem("bp_token", t);
    setToken(t);
    setEmail(emailInput.toLowerCase().trim());
    setCredits(c);
  };

  const register = async (emailInput: string, password: string): Promise<{ verificationRequired: boolean }> => {
    const result = await api.register(emailInput, password);
    if (result.verificationRequired) {
      return { verificationRequired: true };
    }
    // Dev mode: no email verification, token returned directly
    if (result.token) {
      localStorage.setItem("bp_token", result.token);
      setToken(result.token);
      setEmail(emailInput.toLowerCase().trim());
      setCredits(result.credits ?? 0);
    }
    return { verificationRequired: false };
  };

  const logout = () => {
    localStorage.removeItem("bp_token");
    setToken(null);
    setEmail(null);
    setCredits(0);
  };

  return (
    <AuthContext.Provider
      value={{ token, email, credits, loading, login, register, logout, setCredits }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
