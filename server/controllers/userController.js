// Get current logged-in user profile
export const getCurrentUser = async (req, res) => {
  try {
    // req.user is populated by authMiddleware
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
