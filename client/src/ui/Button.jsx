// components/ui/Button.jsx
import { BUTTON_STYLES } from "../utils/constants";

const Button = ({
  children,
  variant = "secondary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  onClick,
  ...props
}) => {
  const baseStyles =
    "font-medium transition-all duration-200 flex items-center justify-center gap-2 rounded-md";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantStyles = {
    primary: BUTTON_STYLES.primary,
    secondary: BUTTON_STYLES.secondary,
    success: BUTTON_STYLES.success,
    disabled: BUTTON_STYLES.disabled,
  };

  const buttonStyles = `
    ${baseStyles} 
    ${sizeStyles[size]} 
    ${disabled ? variantStyles.disabled : variantStyles[variant]}
    ${
      disabled
        ? "opacity-50 cursor-not-allowed"
        : "hover:shadow-lg hover:shadow-gray-900/20"
    }
    ${className}
  `.trim();

  return (
    <button
      className={buttonStyles}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;
