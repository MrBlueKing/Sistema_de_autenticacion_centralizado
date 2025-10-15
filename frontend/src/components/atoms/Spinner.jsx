import { CgSpinner } from 'react-icons/cg';

export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <CgSpinner className={`animate-spin ${sizes[size]} ${className}`} />
  );
}