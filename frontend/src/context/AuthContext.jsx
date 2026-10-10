import { createContext, useState, useEffect } from "react";
import * as authService from "../services/authService";
import { jwtDecode } from "jwt-decode";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.accessToken) {
        try {
          const decoded = jwtDecode(currentUser.accessToken);
          if (decoded.exp * 1000 < Date.now()) {
            authService.logout();
            setUser(null);
          } else {
            setUser({ ...currentUser, role: decoded.role });
          }
        } catch (_e) {
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    const decoded = jwtDecode(data.accessToken);
    setUser({ ...data, role: decoded.role });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
