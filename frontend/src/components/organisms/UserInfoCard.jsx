import Card from '../atoms/Card';
import UserInfo from '../molecules/UserInfo';

export default function UserInfoCard({ user }) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Información del Usuario
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UserInfo label="RUT" value={user?.rut} />
        <UserInfo label="Email" value={user?.email} />
        <UserInfo label="Faena" value={user?.faena?.ubicacion} />
      </div>
    </Card>
  );
}