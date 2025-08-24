export const validateForm = (formData, selectedRole, isLogin) => {
  const errors = [];

  // Email validation
  if (!formData.email) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.push("Please enter a valid email address");
  }

  // Password validation
  if (!formData.password) {
    errors.push("Password is required");
  } else if (formData.password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!isLogin) {
    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
      errors.push("Full name is required (minimum 2 characters)");
    }

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match");
    }

    // Role-specific validation
    if (selectedRole === "patient") {
      if (!formData.age || formData.age < 1 || formData.age > 120) {
        errors.push("Please enter a valid age (1-120)");
      }
      if (!formData.gender) {
        errors.push("Gender selection is required");
      }
    }

    if (selectedRole === "doctor") {
      if (
        !formData.specialization ||
        formData.specialization.trim().length < 2
      ) {
        errors.push("Medical specialization is required");
      }
    }

    if (selectedRole === "frontlineWorker") {
      if (!formData.phone || formData.phone.trim().length < 10) {
        errors.push("Phone number is required (minimum 10 digits)");
      }
      if (!formData.location || formData.location.trim().length < 2) {
        errors.push("Location is required");
      }
    }
  }

  return errors;
};
