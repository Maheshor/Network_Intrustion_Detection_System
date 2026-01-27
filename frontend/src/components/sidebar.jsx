import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const isGuest = sessionStorage.getItem("guest") === "true";

  const linkClasses = ({ isActive }) =>
    `px-4 py-3 rounded-lg transition no-underline text-[19px]
     ${isActive
       ? "bg-green-500/10 text-green-400 border-l-4 border-green-400"
       : "text-gray-300 hover:bg-white/5 hover:text-green-400"}`;

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-72 h-full bg-gradient-to-b from-[#0b0b0b] to-[#050505]
      border-r border-gray-800 px-5 py-6 flex flex-col">

      <h1 className="text-green-400 text-[29px] font-extrabold mb-10 tracking-wide">
        NIDDS
      </h1>

      <nav className="flex flex-col gap-2">
        {/* Dashboard */}
        {!isGuest && <NavLink to="/" end className={linkClasses}>Dashboard</NavLink>}

        {/* Real-Time Scan (visible for all) */}
        <NavLink to="/scan" className={linkClasses}>Real-Time Scan</NavLink>

        {/* Guest users don’t see other options */}
        {!isGuest && (
          <>
            <NavLink to="/manual-check" className={linkClasses}>Manual Check</NavLink>
            <NavLink to="/logs" className={linkClasses}>Intrusion Logs</NavLink>
            <NavLink to="/profile" className={linkClasses}>Profile</NavLink>
          </>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-4 py-3 mt-3 rounded-lg text-[19px] text-start
                     text-red-400 hover:bg-red-500/10 hover:text-red-500 transition"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
