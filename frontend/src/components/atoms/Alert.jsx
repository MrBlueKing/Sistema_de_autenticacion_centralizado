import { HiXCircle, HiCheckCircle, HiExclamationCircle, HiInformationCircle } from 'react-icons/hi2';

export default function Alert({ type = 'info', message, className = '' }) {
  const types = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: HiXCircle,
      iconColor: 'text-red-500',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: HiCheckCircle,
      iconColor: 'text-green-500',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: HiExclamationCircle,
      iconColor: 'text-yellow-500',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: HiInformationCircle,
      iconColor: 'text-blue-500',
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div className={`
      ${config.bg} ${config.border} ${config.text} 
      px-4 py-3 rounded-lg border flex items-start gap-2
      ${className}
    `}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      <span className="text-sm">{message}</span>
    </div>
  );
}