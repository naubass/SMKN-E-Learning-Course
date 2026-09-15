import { Outlet } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';

function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-73px)] bg-gray-50/50 w-full">
      {/* Sidebar tunggal untuk seluruh area dashboard */}
      <DashboardSidebar role={user?.role} />

      {/* Konten utama yang dinamis berdasarkan Outlet */}
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;