export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-indigo-50 text-indigo-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    danger: 'bg-red-50 text-red-700',
  };

  return (
    <span className={`
      px-2 py-1 text-xs font-medium rounded
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
}