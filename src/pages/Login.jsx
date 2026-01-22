import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleSelector from "../components/auth/RoleSelector";
import FloatingInput from "../components/auth/FloatingInput";
import PasswordInput from "../components/auth/PasswordInput";
import AuthButton from "../components/auth/AuthButton";
import StatusFeedback from "../components/auth/StatusFeedback";

export default function Login() {
  const navigate = useNavigate();

  /* ==========================
     STATE
  ========================== */
  const [role, setRole] = useState("student"); // never undefined
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });

  /* ==========================
     SUBMIT HANDLER
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return; // hard guard

    setIsLoading(true);
    setStatus({ type: "loading", message: "Verifying credentials..." });

    const roleToSend = role || "student";

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.username,
          password: formData.password,
          role: roleToSend,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({
          type: "error",
          message: data?.message || "Invalid credentials",
        });
        setIsLoading(false);
        return;
      }

      /* ==========================
         AUTH SUCCESS
      ========================== */
      localStorage.clear();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userName", data.name || "");

      setStatus({
        type: "success",
        message: "Login successful. Redirecting...",
      });

      /* ==========================
         ROLE-BASED REDIRECT
      ========================== */
      setTimeout(() => {
        // Highest priority: backend-controlled redirect
        if (data.redirectUrl) {
          navigate(data.redirectUrl, { replace: true });
          return;
        }

        // Frontend fallback
        switch (data.role) {
          case "student":
            navigate("/dashboard/student", { replace: true });
            break;
          case "faculty":
            navigate("/dashboard/faculty", { replace: true });
            break;
          case "admin":
            navigate("/dashboard/admin", { replace: true });
            break;
          default:
            navigate("/", { replace: true });
        }
      }, 800);
    } catch (error) {
      setStatus({
        type: "error",
        message: "Unable to connect to server. Please try again.",
      });
      setIsLoading(false);
    }
  };

  /* ==========================
     UI
  ========================== */
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 glass-card">
        <h1 className="text-2xl font-bold text-center mb-6">
          Welcome Back
        </h1>

        {/* ROLE SELECTOR */}
        <RoleSelector
          value={role}
          onChange={(newRole) => setRole(newRole || "student")}
        />

        <form onSubmit={handleSubmit} className="space-y-8 mt-10">
          <FloatingInput
            label="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />

          <PasswordInput
            label="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          <StatusFeedback status={status.type} message={status.message} />

          <AuthButton isLoading={isLoading}>
            Sign In
          </AuthButton>
        </form>
      </div>
    </div>
  );
}
