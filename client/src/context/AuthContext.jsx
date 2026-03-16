// client/src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../services/api";

// Safe localStorage helper
const safeLocalStorage = {
  getItem: (key) => {
    try {
      if (typeof Storage !== "undefined") {
        const item = localStorage.getItem(key);
        if (item === null || item === "undefined" || item === undefined) {
          return null;
        }
        return item;
      }
      return null;
    } catch (error) {
      console.warn("localStorage not available:", error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      if (typeof Storage !== "undefined") {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn("localStorage setItem failed:", error);
    }
  },
  removeItem: (key) => {
    try {
      if (typeof Storage !== "undefined") {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn("localStorage removeItem failed:", error);
    }
  },
};

// Helper to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiryTime;
  } catch (error) {
    console.error("Error checking token expiry:", error);
    return true; // Treat invalid tokens as expired
  }
};

// Initial state
const initialState = {
  user: (() => {
    try {
      const userData = safeLocalStorage.getItem("user");
      const token = safeLocalStorage.getItem("token");

      // Check if token is expired before loading user
      if (token && isTokenExpired(token)) {
        console.log("Token expired on initialization, clearing data");
        safeLocalStorage.removeItem("user");
        safeLocalStorage.removeItem("token");
        return null;
      }

      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.warn("Error parsing user data from localStorage:", error);
      safeLocalStorage.removeItem("user");
      safeLocalStorage.removeItem("token");
      return null;
    }
  })(),
  token: (() => {
    const token = safeLocalStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      console.log("Token expired, removing");
      safeLocalStorage.removeItem("token");
      return null;
    }
    return token;
  })(),
  isAuthenticated: (() => {
    const token = safeLocalStorage.getItem("token");
    return !!(token && !isTokenExpired(token));
  })(),
  loading: true,
  error: null,
  initialized: false,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAIL: "LOGIN_FAIL",
  REGISTER_START: "REGISTER_START",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  REGISTER_FAIL: "REGISTER_FAIL",
  LOGOUT: "LOGOUT",
  LOAD_USER_START: "LOAD_USER_START",
  LOAD_USER_SUCCESS: "LOAD_USER_SUCCESS",
  LOAD_USER_FAIL: "LOAD_USER_FAIL",
  CLEAR_ERROR: "CLEAR_ERROR",
  INITIALIZE_COMPLETE: "INITIALIZE_COMPLETE",
  TOKEN_REFRESHED: "TOKEN_REFRESHED",
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
    case AUTH_ACTIONS.LOAD_USER_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      safeLocalStorage.setItem("token", action.payload.token);
      safeLocalStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
        initialized: true,
      };

    case AUTH_ACTIONS.LOAD_USER_SUCCESS:
      safeLocalStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
        initialized: true,
      };

    case AUTH_ACTIONS.LOGIN_FAIL:
    case AUTH_ACTIONS.REGISTER_FAIL:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error:
          typeof action.payload === "string"
            ? { message: action.payload }
            : action.payload,
        initialized: true,
      };

    case AUTH_ACTIONS.LOAD_USER_FAIL:
      // Clear localStorage on load failure (likely expired token)
      safeLocalStorage.removeItem("token");
      safeLocalStorage.removeItem("user");
      console.log("Load user failed, clearing auth data:", action.payload);
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
        initialized: true,
      };

    case AUTH_ACTIONS.LOGOUT:
      safeLocalStorage.removeItem("token");
      safeLocalStorage.removeItem("user");
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        initialized: true,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.INITIALIZE_COMPLETE:
      return {
        ...state,
        loading: false,
        initialized: true,
      };
    case AUTH_ACTIONS.TOKEN_REFRESHED:
      return {
        ...state,
        token: action.payload,
        isAuthenticated: true,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const loadUser = async (signal, isBackgroundCheck = false) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOAD_USER_START });
      const response = await authAPI.getCurrentUser({ signal });
      dispatch({
        type: AUTH_ACTIONS.LOAD_USER_SUCCESS,
        payload: response.data.data,
      });
      return response.data.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        (error.name === "CanceledError" || error.code === "ERR_CANCELED"
          ? "Request canceled/timeout"
          : "Failed to load user");

      // ✅ Only log out user if it's a real 401, not a cold-start/network failure
      if (isBackgroundCheck && error?.response?.status !== 401) {
        // Silent fail — keep user logged in, just stop loading
        dispatch({ type: AUTH_ACTIONS.INITIALIZE_COMPLETE });
      } else {
        dispatch({ type: AUTH_ACTIONS.LOAD_USER_FAIL, payload: message });
      }

      throw error;
    }
  };
  const refreshToken = async () => {
    const response = await authAPI.refresh();
    const newToken = response.data.data.token;
    safeLocalStorage.setItem("token", newToken);
    dispatch({ type: AUTH_ACTIONS.TOKEN_REFRESHED, payload: newToken });
    return newToken;
  };
  // Load user on app start
  useEffect(() => {
    let mounted = true;
    const initializeAuth = async () => {
      const token = safeLocalStorage.getItem("token");

      if (!token || isTokenExpired(token)) {
        // Token missing or expired — attempt silent refresh via HttpOnly cookie
        try {
          await refreshToken(); // Uses the 30-day refresh cookie
          dispatch({ type: AUTH_ACTIONS.INITIALIZE_COMPLETE });
          await loadUser(undefined, true);
        } catch {
          // Refresh cookie also expired or missing — user must log in
          dispatch({ type: AUTH_ACTIONS.INITIALIZE_COMPLETE });
        }
        return;
      }

      dispatch({ type: AUTH_ACTIONS.INITIALIZE_COMPLETE });
      await loadUser(undefined, true).catch(console.warn);
    };

    initializeAuth();
    return () => {
      mounted = false;
    };
  }, []); // Remove state.token dependency to avoid re-initialization

  // Load user profile

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      const response = await authAPI.login(credentials);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: response.data.data,
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error("Login error:", error);
      const backendError = error.response?.data || {
        message: "Login failed",
      };

      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAIL,
        payload: backendError,
      });

      return { success: false, error: backendError };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });
      const response = await authAPI.register(userData);
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: response.data.data,
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error("Register error:", error);
      const backendError = error.response?.data || {
        message: "Registration failed",
      };

      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAIL,
        payload: backendError,
      });

      return { success: false, error: backendError };
    }
  };

  // Logout function
  const logout = async () => {
    // Always attempt the server call first — it clears the HttpOnly refresh
    // cookie. If we skip this and only clear localStorage, the cookie survives
    // and the user gets silently re-logged-in on the next page refresh.
    try {
      await authAPI.logout();
    } catch (error) {
      // Network failure or server error — still clear local state so the UI
      // reflects logged-out, but log so it is visible in devtools.
      console.warn(
        "Logout request failed — clearing local session anyway:",
        error?.response?.status,
      );
    }
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Context value
  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    initialized: state.initialized,
    login,
    register,
    logout,
    loadUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
