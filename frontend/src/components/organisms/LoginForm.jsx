import { useState } from 'react';
import { HiUser, HiLockClosed } from 'react-icons/hi2';
import InputField from '../molecules/InputField';
import Button from '../atoms/Button';
import Alert from '../atoms/Alert';
import Card from '../atoms/Card';

export default function LoginForm({ onSubmit, loading = false }) {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await onSubmit({ rut, password });
    
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <Alert type="error" message={error} />
        )}

        {/* RUT Input */}
        <InputField
          id="rut"
          label="RUT"
          type="text"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          placeholder="12345678-9"
          required
          icon={HiUser}
        />

        {/* Password Input */}
        <InputField
          id="password"
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          icon={HiLockClosed}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>

      {/* Usuarios de prueba */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center mb-2">
          Usuarios de prueba:
        </p>
        <div className="text-xs text-gray-600 space-y-1">
          <div className="bg-gray-50 p-2 rounded">
            <strong>Admin:</strong> 12345678-9 / password
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <strong>Usuario:</strong> 98765432-1 / password
          </div>
        </div>
      </div>
    </Card>
  );
}