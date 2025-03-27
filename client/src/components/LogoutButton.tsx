import { useUser } from "@/contexts/user-context";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export function LogoutButton({ className }: { className?: string }) {
  const { logout } = useUser();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  return (
    <button 
      onClick={handleLogout}
      className={`flex items-center p-2 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 ${className || ""}`}
    >
      <LogOut className="w-5 h-5 mr-3" />
      <span>Logout</span>
    </button>
  );
}