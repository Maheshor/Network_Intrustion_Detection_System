import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  // login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // forgot password
  const [showForgot, setShowForgot] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🚫 redirect if already logged in
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      sessionStorage.removeItem("guest");

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  // ================= SEND OTP =================
  const handleSendOtp = async () => {
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email
      });

      setOtpSent(true);
      setSuccess("OTP sent to your email");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to send OTP");
    }
  };

  // ================= RESET PASSWORD =================
  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        otp,
        newPassword
      });

      setSuccess("Password reset successful. Please login.");
      setTimeout(() => {
        setShowForgot(false);
        setOtpSent(false);
        setOtp("");
        setNewPassword("");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid OTP or expired");
    }
  };

  // ================= GUEST =================
  const handleGuestLogin = () => {
    sessionStorage.setItem("guest", "true");
    sessionStorage.removeItem("token");
    navigate("/scan", { replace: true });
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-dark">
      <div className="card text-white bg-dark border-secondary p-4" style={{ width: "24rem" }}>

        <h2 className="text-center mb-4">
          {showForgot ? "Reset Password" : "Login"}
        </h2>

        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}

        {!showForgot ? (
          /* ================= LOGIN FORM ================= */
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="email"
                placeholder="Email"
                className="form-control bg-black text-white border-secondary"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                placeholder="Password"
                className="form-control bg-black text-white border-secondary"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100 fw-bold">
              Login
            </button>

            <button
              type="button"
              onClick={handleGuestLogin}
              className="btn btn-outline-secondary w-100 fw-bold mt-2"
            >
              Continue as Guest
            </button>

            <p className="text-center mt-3">
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="btn btn-link text-secondary text-decoration-none p-0"
              >
                Forgot password?
              </button>
            </p>
          </form>
        ) : (
          /* ================= FORGOT PASSWORD ================= */
          <>
            <div className="mb-3">
              <input
                type="email"
                placeholder="Registered Email"
                className="form-control bg-black text-white border-secondary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {!otpSent ? (
              <button
                onClick={handleSendOtp}
                className="btn btn-warning w-100 fw-bold"
              >
                Send OTP
              </button>
            ) : (
              <>
                <div className="mb-3 mt-3">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="form-control bg-black text-white border-secondary"
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    placeholder="New Password"
                    className="form-control bg-black text-white border-secondary"
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  onClick={handleResetPassword}
                  className="btn btn-success w-100 fw-bold"
                >
                  Reset Password
                </button>
              </>
            )}

            <p className="text-center mt-3">
              <button
                onClick={() => {
                  setShowForgot(false);
                  setOtpSent(false);
                }}
                className="btn btn-link text-secondary text-decoration-none p-0"
              >
                Back to Login
              </button>
            </p>
          </>
        )}

        {!showForgot && (
          <p className="text-center text-secondary mt-3">
            No account?{" "}
            <Link to="/register" className="text-success text-decoration-none">
              Register
            </Link>
          </p>
        )}

      </div>
    </div>
  );
}  