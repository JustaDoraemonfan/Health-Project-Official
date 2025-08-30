// components/ui/Badge.jsx

const Badge = ({
  children,
  variant = "default",
  size = "sm",
  icon: Icon,
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center font-medium rounded shadow-md whitespace-nowrap";

  const sizeStyles = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
  };

  const variantStyles = {
    default: "bg-gray-800 text-gray-300 border border-gray-700",
    success:
      "bg-green-900/40 text-green-300 border border-green-700 shadow-green-900/20",
    error: "bg-red-900/40 text-red-300 border border-red-700 shadow-red-900/20",
    warning:
      "bg-yellow-900/40 text-yellow-300 border border-yellow-700 shadow-yellow-900/20",
    info: "bg-blue-900/30 text-blue-300 border border-blue-800",
    specialty: "bg-gray-800 text-gray-300 border border-gray-700",
  };

  const badgeStyles = `
    ${baseStyles} 
    ${sizeStyles[size]} 
    ${variantStyles[variant]}
    ${className}
  `.trim();

  return (
    <span className={badgeStyles}>
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      {children}
    </span>
  );
};

export default Badge;
