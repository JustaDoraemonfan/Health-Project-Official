// utils/api.js - Fixed version
const API_URL = "http://localhost:5000/api";

// Simple login function
export const loginUser = async (email, password) => {
  try {
    console.log("🚀 Starting login request...");
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("📥 Login API response:", data);
    console.log("📊 Response status:", response.status);
    console.log("📊 Response ok:", response.ok);

    // Check if the HTTP request was successful first
    if (!response.ok) {
      console.log("❌ HTTP request failed");
      return {
        success: false,
        message: data.message || `HTTP Error: ${response.status}`,
      };
    }

    // Check for success based on your backend structure
    const isSuccessful = data.success === true && data.data && data.data.token;

    console.log("✅ Success check result:", isSuccessful);

    if (isSuccessful) {
      // Your backend structure: { success: true, data: { token, name, email, role, _id } }
      const token = data.data.token;
      const userInfo = { ...data.data };
      delete userInfo.token; // Remove token from user object

      console.log("💾 Storing token:", token ? "✅ Found" : "❌ Missing");
      console.log("💾 Storing user info:", userInfo);

      // Store in localStorage
      if (token) localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userInfo));

      return { success: true, user: userInfo, message: data.message };
    } else {
      console.log("❌ Login failed - no success indicators found");
      return {
        success: false,
        message: data.message || data.error || "Login failed",
      };
    }
  } catch (error) {
    console.error("❌ Login error caught:", error);
    return {
      success: false,
      message: error.message || "Network error. Please try again.",
    };
  }
};

// Simple register function
export const registerUser = async (userData) => {
  try {
    console.log("🚀 Starting registration request...");
    console.log("📤 Registration data:", userData);

    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log("📥 Register API response:", data);
    console.log("📊 Response status:", response.status);

    // Check if the HTTP request was successful first
    if (!response.ok) {
      console.log("❌ HTTP request failed");
      return {
        success: false,
        message: data.message || `HTTP Error: ${response.status}`,
      };
    }

    // Check for success based on your backend structure
    const isSuccessful = data.success === true && data.data && data.data.token;

    console.log("✅ Success check result:", isSuccessful);

    if (isSuccessful) {
      // Your backend structure: { success: true, data: { token, name, email, role, _id } }
      const token = data.data.token;
      const userInfo = { ...data.data };
      delete userInfo.token; // Remove token from user object

      console.log("💾 Storing token:", token ? "✅ Found" : "❌ Missing");
      console.log("💾 Storing user info:", userInfo);

      // Store in localStorage
      if (token) localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userInfo));

      return { success: true, user: userInfo, message: data.message };
    } else {
      console.log("❌ Registration failed - no success indicators found");
      return {
        success: false,
        message: data.message || data.error || "Registration failed",
      };
    }
  } catch (error) {
    console.error("❌ Register error caught:", error);
    return {
      success: false,
      message: error.message || "Network error. Please try again.",
    };
  }
};

// Simple logout function
export const logoutUser = () => {
  console.log("🚪 Logging out user...");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  console.log("✅ Logout complete");
};

// Check if user is logged in
export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const isLoggedIn = !!(token && user);
  console.log("🔍 Checking login status:", isLoggedIn);
  return isLoggedIn;
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  console.log("👤 Getting current user:", user ? user.name : "None");
  return user;
};
