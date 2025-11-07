// components/organisms/ProfileForm.jsx
import React, { useState } from 'react';
import { HiUser, HiEnvelope, HiIdentification } from 'react-icons/hi2';
import ProfileSection from '../molecules/Profilesection';
import ProfileField from '../molecules/ProfileField';
import Button from '../atoms/Button';
import userService from '../../services/userService';
import Label from '../atoms/label';

const ProfileForm = ({ user, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await userService.updateProfile(formData);
      setSuccessMessage(response.message);

      // Llamar callback para actualizar el usuario en el contexto
      if (onUpdateSuccess) {
        onUpdateSuccess(response.user);
      }

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Error al actualizar el perfil. Intenta nuevamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileSection
      title="Información Personal"
      description="Actualiza tus datos personales"
      icon={HiUser}
    >
      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
        {/* 
          Campo username oculto para evitar warning de Chrome
          Chrome detecta el campo email y cree que es un form de login
          Agregamos este campo para indicarle que NO es un password form
        */}
        <div style={{ display: 'none' }}>
          <label htmlFor="profile-username">Username</label>
          <input
            type="text"
            name="username"
            id="profile-username"
            autoComplete="username"
            value={user?.rut || ''}
            onChange={() => { }}
            tabIndex={-1}
          />
        </div>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg" role="alert">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-700 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error general */}
        {errors.general && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg" role="alert">
            <p className="text-red-700 font-medium">{errors.general}</p>
          </div>
        )}

        {/* RUT (no editable) */}
        <ProfileField
          label="RUT"
          name="rut"
          value={user?.rut || ''}
          disabled={true}
          icon={HiIdentification}
          placeholder="12.345.678-9"
        />

        {/* Nombre */}
        <ProfileField
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required={true}
          error={errors.nombre?.[0]}
          icon={HiUser}
          placeholder="Ingresa tu nombre"
        />

        {/* Apellido */}
        <ProfileField
          label="Apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          required={true}
          error={errors.apellido?.[0]}
          icon={HiUser}
          placeholder="Ingresa tu apellido"
        />

        {/* Email */}
        <ProfileField
          label="Correo Electrónico"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required={true}
          error={errors.email?.[0]}
          icon={HiEnvelope}
          placeholder="correo@ejemplo.com"
        />

        {/* Faena (no editable) */}
        {user?.faena && (
          <div>
            <Label>Faena Asignada</Label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user.faena.ubicacion}</p>
                {user.faena.detalle && (
                  <p className="text-sm text-gray-600">{user.faena.detalle}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Botón de guardar */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            Guardar Cambios
          </Button>
        </div>
      </form>
    </ProfileSection>
  );
};

export default ProfileForm;