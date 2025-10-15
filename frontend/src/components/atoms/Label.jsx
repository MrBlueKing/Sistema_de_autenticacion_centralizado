export default function Label({ children, required = false, htmlFor }) {
  return (
    <label 
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}