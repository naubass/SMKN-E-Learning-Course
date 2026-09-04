import { useAuth } from '../store/AuthContext';
import StudentDashboard from './dashboard/StudentDashboard';
import InstructorDashboard from './dashboard/InstructorDashboard';
import AdminDashboard from './dashboard/AdminDashboard';

const DASHBOARD_BY_ROLE = {
  STUDENT: StudentDashboard,
  INSTRUCTOR: InstructorDashboard,
  ADMIN: AdminDashboard,
};

function Dashboard() {
  const { user } = useAuth();

  const DashboardComponent = DASHBOARD_BY_ROLE[user?.role] ?? StudentDashboard;

  return <DashboardComponent user={user} />;
}

export default Dashboard;