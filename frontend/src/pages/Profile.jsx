import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (!storedUser) {
      navigate("/login", { replace: true });
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleDeleteAccount = () => {
    // 🔴 Later connect to backend delete API
    alert("Delete account feature will be implemented later.");

    // Temporary logout
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  if (!user) return null;

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div
        className="card text-white bg-dark border-secondary p-4"
        style={{ width: "26rem" }}
      >
        <h3 className="fw-bold mb-4 text-center text-success">
          Profile
        </h3>

        <p className="text-secondary mb-1">Name</p>
        <p className="h5 mb-3">{user.name}</p>

        <p className="text-secondary mb-1">Email</p>
        <p className="h5 mb-4">{user.email}</p>

        {/* <button
          onClick={handleDeleteAccount}
          className="btn btn-danger w-100 fw-bold"
        >
          Delete Account
        </button> */}
      </div>
    </div>
  );
}
