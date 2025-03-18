const Input = ({ 
    label, 
    type = 'text', 
    name, 
    value, 
    onChange, 
    placeholder = '', 
    required = false,
    className = ''
  }) => {
    return (
      <div className={`mb-4 ${className}`}>
        {label && (
          <label 
            htmlFor={name} 
            className="block text-gray-700 font-medium mb-2"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
    );
  };
  
  export default Input;