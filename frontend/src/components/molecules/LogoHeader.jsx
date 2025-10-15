import { HiLockClosed } from 'react-icons/hi2';

export default function LogoHeader({ title, subtitle }) {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
        <HiLockClosed className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-600">{subtitle}</p>
      )}
    </div>
  );
}