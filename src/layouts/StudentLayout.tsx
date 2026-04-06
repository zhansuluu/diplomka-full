import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Search,
  Briefcase,
  LogOut,
  Heart
} from "lucide-react";

export const StudentLayout = () => {
  const location = useLocation();

  const navItem = (to: string, label: string, Icon: any) => (
    <Link
      to={to}
      className={`flex items-center gap-3 border-2 border-black px-4 py-2 rounded shadow-[4px_4px_0px_black]
        ${location.pathname.includes(to.split("/").pop() || "")
          ? "bg-[#5D0CA0] text-white"
          : "bg-white"}
      `}
    >
      <Icon size={18} />
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#FBF9FF] relative overflow-hidden">

      {/* Dot background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, #CFCCCC 1.5px, transparent 1.5px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#EDE7FF] border-r-2 border-black p-6 flex flex-col justify-between gap-6 z-10">
        <div className="flex flex-col gap-6">

        <div>
          <h1 className="text-xl font-bold">CaseUp</h1>
          <p className="text-sm text-gray-600">Virtual Internships</p>
        </div>

        <nav className="flex flex-col gap-3">

          {navItem("/student/dashboard", "Dashboard", LayoutDashboard)}
          {navItem("/student/profile", "Profile", User)}
          {navItem("/student/internships", "Find Internships", Search)}
          {navItem("/student/my-internship", "My Internship", Briefcase)}
          {navItem("/student/favorites", "Favorites", Heart)}

        </nav>
        </div>


        <Link to="/logout" className="flex items-center gap-3 border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded">
          <LogOut size={18} />
          Logout
        </Link>
        
      </aside>

      

      {/* Content */}
      <main className="ml-64 p-10 relative z-10">
        <Outlet />
      </main>
    </div>
  );
};