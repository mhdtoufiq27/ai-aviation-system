import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const getRoleHome = (role) => {
  if (!role) return '/login';
  const r = role.toLowerCase();
  if (r === 'admin') return '/admin/dashboard';
  if (r === 'airline_manager' || r === 'manager') return '/manager/dashboard';
  if (r === 'staff' || r === 'ground_staff') return '/staff/dashboard';
  if (r === 'passenger') return '/passenger/dashboard';
  return '/login';
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || localStorage.getItem('skyflow_token') || null;
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user') || localStorage.getItem('skyflow_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Sync token to API headers if exists
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('skyflow_token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('skyflow_token');
    }
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      if (res.data?.success && res.data?.token) {
        const authToken = res.data.token;
        const authUser = res.data.user;

        localStorage.setItem('token', authToken);
        localStorage.setItem('skyflow_token', authToken);
        localStorage.setItem('user', JSON.stringify(authUser));
        localStorage.setItem('skyflow_user', JSON.stringify(authUser));
        localStorage.setItem('role', authUser.role);

        setToken(authToken);
        setUser(authUser);

        return {
          success: true,
          user: authUser,
          token: authToken,
          redirectUrl: getRoleHome(authUser.role),
        };
      } else {
        throw new Error(res.data?.message || 'Authentication failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid email or password';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authApi.register(userData);
      if (res.data?.success && res.data?.token) {
        const authToken = res.data.token;
        const authUser = res.data.user;

        localStorage.setItem('token', authToken);
        localStorage.setItem('skyflow_token', authToken);
        localStorage.setItem('user', JSON.stringify(authUser));
        localStorage.setItem('skyflow_user', JSON.stringify(authUser));
        localStorage.setItem('role', authUser.role);

        setToken(authToken);
        setUser(authUser);

        return {
          success: true,
          user: authUser,
          token: authToken,
          redirectUrl: getRoleHome(authUser.role),
        };
      }
      throw new Error(res.data?.message || 'Registration failed');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Clean Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('skyflow_token');
    localStorage.removeItem('skyflow_user');
    setUser(null);
    setToken(null);
  };

  // Profile update handler
  const updateProfile = (updatedFields) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    localStorage.setItem('skyflow_user', JSON.stringify(updated));
  };

  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
        getRoleHome,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
