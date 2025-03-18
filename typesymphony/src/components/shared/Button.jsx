const Button = ({ 
    children, 
    onClick, 
    type = 'button', 
    className = '', 
    disabled = false 
  }) => {
    const baseClasses = "px-4 py-2 rounded font-medium transition-colors focus:outline-none";
    const variantClasses = "bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700";
    const disabledClasses = "opacity-50 cursor-not-allowed";
    
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variantClasses} ${disabled ? disabledClasses : ''} ${className}`}
      >
        {children}
      </button>
    );
  };
  
  export default Button;