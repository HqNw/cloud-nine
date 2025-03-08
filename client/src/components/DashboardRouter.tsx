import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/user-context";
import StudentDashboard from "@/pages/student/dashboard";
import TeacherDashboard from "@/pages/teacher/dashboard";

// Dashboard component that conditionally renders based on user role
export default function DashboardRouter() {
  const { userType, isAuthenticated } = useUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return userType === "student" ? <StudentDashboard /> : <TeacherDashboard />;
}
