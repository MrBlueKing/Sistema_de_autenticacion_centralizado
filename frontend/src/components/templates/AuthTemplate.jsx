export default function AuthTemplate({ children, logo, footer }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        {logo}

        {/* Contenido principal (formulario) */}
        {children}

        {/* Footer */}
        {footer && (
          <p className="text-center text-sm text-gray-600 mt-6">
            {footer}
          </p>
        )}
      </div>
    </div>
  );
}