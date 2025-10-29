// components/organisms/PasswordChangeForm.jsx
import React, { useState } from 'react';
import { HiLockClosed, HiEye, HiEyeSlash } from 'react-icons/hi2';
import ProfileSection from '../molecules/Profilesection';
import Label from '../atoms/label';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import userService from '../../services/userService';

const PasswordChangeForm = () => {
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
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

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const response = await userService.changePassword(formData);
            setSuccessMessage(response.message);

            // Limpiar formulario
            setFormData({
                current_password: '',
                new_password: '',
                new_password_confirmation: '',
            });

            // Limpiar mensaje después de 5 segundos
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: 'Error al cambiar la contraseña. Intenta nuevamente.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const PasswordInput = ({ label, name, value, show, field, autoComplete }) => (
        <div className="w-full">
            <Label htmlFor={name} required={true}>
                {label}
            </Label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <HiLockClosed className="w-5 h-5" />
                </div>
                <Input
                    type={show ? 'text' : 'password'}
                    name={name}
                    id={name}
                    value={value}
                    onChange={handleChange}
                    error={errors[name]?.[0]}
                    autoComplete={autoComplete}
                    className="pl-11 pr-11"
                />
                <button
                    type="button"
                    onClick={() => togglePasswordVisibility(field)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {show ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );

    return (
        <ProfileSection
            title="Cambiar Contraseña"
            description="Actualiza tu contraseña de acceso"
            icon={HiLockClosed}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    style={{ display: 'none' }}
                />
                {/* Mensaje de éxito */}
                {successMessage && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
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
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <p className="text-red-700 font-medium">{errors.general}</p>
                    </div>
                )}

                {/* Información de seguridad */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm text-blue-700">
                            <p className="font-semibold mb-1">Requisitos de seguridad:</p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>Mínimo 8 caracteres</li>
                                <li>Debe ser diferente a tu contraseña actual</li>
                                <li>Se cerrarán las sesiones en otros dispositivos</li>
                            </ul>
                        </div>
                    </div>
                </div>


                {/* Contraseña actual */}
                <PasswordInput
                    label="Contraseña Actual"
                    name="current_password"
                    value={formData.current_password}
                    show={showPasswords.current}
                    field="current"
                    autoComplete="current-password"
                />

                {/* Nueva contraseña */}
                <PasswordInput
                    label="Nueva Contraseña"
                    name="new_password"
                    value={formData.new_password}
                    show={showPasswords.new}
                    field="new"
                    autoComplete="current-password"
                />

                {/* Confirmar nueva contraseña */}
                <PasswordInput
                    label="Confirmar Nueva Contraseña"
                    name="new_password_confirmation"
                    value={formData.new_password_confirmation}
                    show={showPasswords.confirm}
                    field="confirm"
                    autoComplete="new-password"
                />

                {/* Botón de guardar */}
                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        disabled={loading}
                    >
                        Cambiar Contraseña
                    </Button>
                </div>
            </form>
        </ProfileSection>
    );
};

export default PasswordChangeForm;