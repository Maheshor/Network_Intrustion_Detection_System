import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark">
      <div className="card text-white bg-dark border-secondary p-4" style={{ width: "24rem" }}>
        <h2 className="card-title text-center mb-4">Register</h2>

        {error && <p className="text-danger mb-3">{error}</p>}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control bg-black text-white border-secondary"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control bg-black text-white border-secondary"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control bg-black text-white border-secondary"
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100 fw-bold">
            Register
          </button>
        </form>

        <p className="text-center text-secondary mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-success">Login</Link>
        </p>
      </div>
    </div>
  );
}
