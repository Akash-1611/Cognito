import { useState } from "react";
import { login } from "../utils/api";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(form);
      console.log("✅ Login successful! Token:", response.token);
  
      localStorage.setItem("token", response.token);
      setIsAuthenticated(true);
      navigate("/ide");
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      alert(`Login failed: ${err.response?.data?.error || "Unknown error"}`);
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form className="bg-gray-800 p-8 rounded shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-white text-lg mb-4">Login</h2>
        <input className="p-2 mb-4 w-full bg-gray-700 text-white rounded" type="text" placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input className="p-2 mb-4 w-full bg-gray-700 text-white rounded" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="w-full p-2 bg-blue-500 text-white rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
