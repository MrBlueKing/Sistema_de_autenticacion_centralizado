export default function DashboardTemplate({ header, userInfo, modules, infoBox }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {header}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="mb-8">
          {userInfo}
        </div>

        {/* Modules Grid */}
        <div className="mb-8">
          {modules}
        </div>

        {/* Info Box */}
        {infoBox && (
          <div className="mt-8">
            {infoBox}
          </div>
        )}
      </main>
    </div>
  );
}