import { Link } from "react-router-dom";
import { LogOut, Moon, Sun, Video, Upload, Edit } from "lucide-react";
import { useUser, UserType } from "@/contexts/user-context";

interface SidebarItem {
  icon: string;
  title: string;
  link?: string; // Make link optional
  foruser?: UserType;
  onClick?: () => void; // Add onClick handler
  type?: "link" | "button"; // Explicit type for the item
}

interface SidebarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
  isMobileMenuOpen: boolean;
  userType: "student" | "teacher";
  items: SidebarItem[];
}

export function Sidebar({ theme, toggleTheme, isMobileMenuOpen, userType, items }: SidebarProps) {
  const { logout } = useUser();

  const isTeacher = userType === "teacher";
  const portalTitle = isTeacher ? "Teacher Portal" : "Student Portal";
  const portalDescription = isTeacher ? "Manage your lessons" : "Access your courses";

  const renderIcon = (icon: string) => {
    switch (icon) {
      case "video":
        return <Video className="w-5 h-5 mr-3" />;
      case "upload":
        return <Upload className="w-5 h-5 mr-3" />;
      default:
        return null;
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 transition-all duration-300 transform ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">{portalTitle}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{portalDescription}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {items.map((item) => {
            if (item.foruser && item.foruser !== userType) {
              return null;
            }

            const commonProps = {
              key: item.title,
              className: "flex items-center p-2 w-full rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700",
              children: (
                <>
                  {renderIcon(item.icon)}
                  <span>{item.title}</span>
                </>
              )
            };

            // Render as button if onClick is provided
            if (item.onClick) {
              return (
                <button
                  {...commonProps}
                  onClick={item.onClick}
                  type="button"
                />
              );
            }

            // Default to Link if link is provided
            return (
              <Link
                {...commonProps}
                to={item.link || "#"} // Provide fallback for typescript
              />
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
          <button
            onClick={toggleTheme}
            className="flex items-center p-2 w-full rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
          >
            {theme === "light" ? <Moon className="w-5 h-5 mr-3" /> : <Sun className="w-5 h-5 mr-3" />}
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          </button>

          <span className="block h-px my-2 bg-zinc-200 dark:bg-zinc-700"></span>

          <Link
            to="#"
            className="flex items-center p-2 w-full rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
          >
            <Edit className="w-5 h-5 mr-3" />
            <span>Edit Profile</span>
          </Link>
          <Link
            to="/"
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="flex items-center p-2 mt-2 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}