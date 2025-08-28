// profileConfig.js
export const profileFields = {
  patient: [
    { name: "name", label: "Full Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "age", label: "Age", type: "number" },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: ["Male", "Female", "Other"],
    },
    { name: "phone", label: "Phone Number", type: "text" },
  ],
  doctor: [
    { name: "name", label: "Full Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "specialization", label: "Specialization", type: "text" },
    { name: "experience", label: "Experience (years)", type: "number" },
    { name: "consultationFee", label: "Consultation Fee", type: "number" },
    { name: "languages", label: "Languages", type: "text" },
    { name: "phone", label: "Phone Number", type: "text" },
  ],
  admin: [
    { name: "name", label: "Full Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "role", label: "Role", type: "text" },
    { name: "phone", label: "Phone Number", type: "text" },
  ],
  hospital: [
    { name: "name", label: "Hospital Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "location", label: "Location", type: "text" },
    { name: "capacity", label: "Capacity", type: "number" },
    { name: "phone", label: "Contact Number", type: "text" },
  ],
};
