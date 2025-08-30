// client/src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../services/api";

// Safe localStorage helper
const safeLocalStorage = {
  getItem: (key) => {
    try {
      if (typeof Storage !== "undefined") {
        const item = localStorage.getItem(key);
        // Check if the item is null, undefined, or the string "undefined"
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

// Initial state
const initialState = {
  user: (() => {
    try {
      const userData = safeLocalStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.warn("Error parsing user data from localStorage:", error);
      // Clear the corrupted data
      safeLocalStorage.removeItem("user");
      return null;
    }
  })(),
  token: safeLocalStorage.getItem("token"),
  isAuthenticated: !!safeLocalStorage.getItem("token"),
  loading: true,
  error: null,
  initialized: false, // Add this to track if auth has been initialized
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
        error: action.payload,
        initialized: true,
      };

    case AUTH_ACTIONS.LOAD_USER_FAIL:
      // Don't clear localStorage immediately on load user fail
      // Let the user stay logged in locally, but mark as not authenticated
      console.log("Load user failed:", action.payload);
      return {
        ...state,
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
      console.log("Initializing auth...", {
        hasToken: !!state.token,
        token: state.token?.substring(0, 10) + "...",
      });

      if (state.token) {
        try {
          await loadUser();
        } catch (error) {
          console.error("Failed to load user during initialization:", error);
          // Don't immediately log out on initialization failure
          // Just mark as initialized
          dispatch({ type: AUTH_ACTIONS.INITIALIZE_COMPLETE });
        }
      } else {
        console.log("No token found, marking as initialized");
        dispatch({ type: AUTH_ACTIONS.INITIALIZE_COMPLETE });
      }
    };

    initializeAuth();
  }, []); // Keep empty dependency array

  // Load user profile
  const loadUser = async () => {
    try {
      console.log("Loading user...");
      dispatch({ type: AUTH_ACTIONS.LOAD_USER_START });
      const response = await authAPI.getCurrentUser();
      console.log("User loaded successfully:", response.data);
      dispatch({
        type: AUTH_ACTIONS.LOAD_USER_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      console.error("Load user error:", error);
      console.log("Error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        url: error.config?.url,
      });
      dispatch({
        type: AUTH_ACTIONS.LOAD_USER_FAIL,
        payload: error.response?.data?.message || "Failed to load user",
      });
      throw error; // Re-throw to handle in initialization
    }
  };

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
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: response.data.data,
      });
      return { success: true, data: response.data.data };
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
