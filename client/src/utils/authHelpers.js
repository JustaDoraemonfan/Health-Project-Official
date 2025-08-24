export const createFormData = (formData, selectedRole, isLogin) => {
  // This is now just for logging/demo purposes
  const data = {
    email: formData.email.trim().toLowerCase(),
    role: selectedRole,
    loginType: isLogin ? "login" : "register",
  };

  if (!isLogin) {
    data.name = formData.name.trim();

    // Add role-specific fields
    if (selectedRole === "patient") {
      data.age = parseInt(formData.age);
      data.gender = formData.gender;
    } else if (selectedRole === "doctor") {
      data.specialization = formData.specialization.trim();
    } else if (selectedRole === "frontlineWorker") {
      data.phone = formData.phone.trim();
      data.location = formData.location.trim();
    }
  }

  return data;
};
