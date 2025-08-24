// utils/api.js - Fixed for your backend structure
const API_URL = "http://localhost:5000/api";

// Simple login function
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Login API response:", data);

    // Check if login was successful (your backend doesn't send success field)
    // Instead it sends "Login successful" message when successful
    const isSuccessful =
      data.message &&
      data.message.toLowerCase().includes("successful") &&
      data.user;

    if (isSuccessful) {
      // Extract token and user info from your backend structure
      const { token, ...userInfo } = data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userInfo));

      return { success: true, user: userInfo };
    } else {
      return { success: false, message: data.message || "Login failed" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
};

// Simple register function
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log("Register API response:", data);

    // Check if registration was successful (same pattern as login)
    const isSuccessful =
      data.message &&
      data.message.toLowerCase().includes("successful") &&
      data.user;

    if (isSuccessful) {
      // Extract token and user info from your backend structure
      const { token, ...userInfo } = data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userInfo));

      return { success: true, user: userInfo };
    } else {
      return { success: false, message: data.message || "Registration failed" };
    }
  } catch (error) {
    console.error("Register error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
};

// Simple logout function
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Check if user is logged in
export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return !!(token && user);
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};
