// client/src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../services/api";

// Safe localStorage helper
const safeLocalStorage = {
  getItem: (key) => {
    try {
      return typeof Storage !== "undefined" ? localStorage.getItem(key) : null;
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

// Initial state
const initialState = {
  user: null,
  token: safeLocalStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  error: null,
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
      return {
        ...state,
        user: action.payload,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOAD_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAIL:
    case AUTH_ACTIONS.REGISTER_FAIL:
    case AUTH_ACTIONS.LOAD_USER_FAIL:
      safeLocalStorage.removeItem("token");
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      safeLocalStorage.removeItem("token");
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
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

  // Load user on app start
  useEffect(() => {
    const initializeAuth = async () => {
      if (state.token) {
        await loadUser();
      } else {
        dispatch({ type: AUTH_ACTIONS.LOAD_USER_FAIL, payload: null });
      }
    };

    initializeAuth();
  }, []); // Remove state.token dependency to prevent infinite loops

  // Load user profile
  const loadUser = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOAD_USER_START });
      const response = await authAPI.getCurrentUser();
      dispatch({
        type: AUTH_ACTIONS.LOAD_USER_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      console.error("Load user error:", error);
      dispatch({
        type: AUTH_ACTIONS.LOAD_USER_FAIL,
        payload: error.response?.data?.message || "Failed to load user",
      });
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      const response = await authAPI.login(credentials);
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed";
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAIL, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });
      const response = await authAPI.register(userData);
      dispatch({ type: AUTH_ACTIONS.REGISTER_SUCCESS, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Register error:", error);
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      dispatch({ type: AUTH_ACTIONS.REGISTER_FAIL, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
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
