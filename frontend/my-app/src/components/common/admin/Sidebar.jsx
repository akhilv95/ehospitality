import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserRound,
  CalendarDays,
  FileText,
  CreditCard,
  BarChart3,
  LogOut,
} from "lucide-react";

const Sidebar = () => {

  const menus = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      name: "Doctors",
      icon: Users,
      path: "/admin/doctors",
    },
    {
      name: "Patients",
      icon: UserRound,
      path: "/admin/patients",
    },
    {
      name: "Appointments",
      icon: CalendarDays,
      path: "/admin/appointments",
    },
    {
      name: "Billing",
      icon: CreditCard,
      path: "/admin/billing",
    },
    {
      name: "Reports",
      icon: BarChart3,
      path: "/admin/reports",
    },
  ];

  return (
    <aside className="w-72 bg-blue-900 text-white">

      <div className="text-2xl font-bold p-6 border-b border-blue-700">
        HMS Admin
      </div>

      <nav className="mt-4">

        {menus.map((menu) => {

          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.path}
              to={menu.path}
              end={menu.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-4 transition ${
                  isActive
                    ? "bg-blue-700"
                    : "hover:bg-blue-800"
                }`
              }
            >
              <Icon size={20} />

              {menu.name}
            </NavLink>
          );
        })}

      </nav>

      <div className="absolute bottom-0 w-72 border-t border-blue-700">

        <button
          className="flex items-center gap-3 px-6 py-4 w-full hover:bg-red-600"
        >
          <LogOut size={20} />

          Logout
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;