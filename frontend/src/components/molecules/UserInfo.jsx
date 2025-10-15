export default function UserInfo({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value || 'No disponible'}</p>
    </div>
  );
}