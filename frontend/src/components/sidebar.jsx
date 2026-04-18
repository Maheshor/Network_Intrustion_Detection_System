import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const isGuest = sessionStorage.getItem("guest") === "true";
  const [showModal, setShowModal] = useState(false);

  const linkClasses = ({ isActive }) =>
    `px-4 py-3 rounded-lg transition no-underline text-[19px]
     ${isActive
       ? "bg-green-500/10 text-green-400 border-l-4 border-green-400"
       : "text-gray-300 hover:bg-white/5 hover:text-green-400"}`;

  const confirmLogout = () => {
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <aside className="w-72 h-full bg-gradient-to-b from-[#0b0b0b] to-[#050505]
        border-r border-gray-800 px-5 py-6 flex flex-col">

        <h1 className="text-green-400 text-[29px] font-extrabold mb-10 tracking-wide">
          NIDDS
        </h1>

        <nav className="flex flex-col gap-2">
          {!isGuest && <NavLink to="/" end className={linkClasses}>Dashboard</NavLink>}
          <NavLink to="/scan" className={linkClasses}>Real-Time Scan</NavLink>

          {!isGuest && (
            <>
              <NavLink to="/manual-check" className={linkClasses}>Manual Check</NavLink>
              <NavLink to="/logs" className={linkClasses}>Intrusion Logs</NavLink>
              <NavLink to="/profile" className={linkClasses}>Profile</NavLink>
            </>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-3 mt-3 rounded-lg text-[19px] text-start
                       text-red-400 hover:bg-red-500/10 hover:text-red-500 transition"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* 🔥 Custom Logout Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center
                        bg-black/60 backdrop-blur-sm z-50">

          <div className="bg-[#0f172a] border border-gray-700
                          rounded-2xl p-8 w-[360px] text-center
                          shadow-2xl animate-fadeIn">

            <h2 className="text-2xl font-bold text-green-400 mb-4">
              Confirm Logout
            </h2>

            <p className="text-gray-300 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-lg bg-gray-700
                           text-gray-300 hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
                className="px-5 py-2 rounded-lg bg-red-500
                           text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
