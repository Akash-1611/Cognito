import { useState } from "react";
import { register } from "../utils/api";
import { useNavigate } from "react-router-dom";

const Register = ({ setIsAuthenticated }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("🚀 Registering user with:", form);
      
      // ✅ Correct Destructuring
      const data = await register(form);
      
      console.log("✅ Registration Success, Received Data:", data);
  
      // ✅ Check if token exists before using it
      if (!data.token) {
        throw new Error("Token not received from server");
      }
  
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      navigate("/ide");
    } catch (err) {
      console.error("❌ Registration failed:", err);
      
      // ✅ Handle cases where error may not have response data
      const errorMessage = err.response?.data?.error || err.message || "Try again.";
      alert("Registration failed! " + errorMessage);
    }
  };
  
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form className="bg-gray-800 p-8 rounded shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-white text-lg mb-4">Register</h2>
        <input className="p-2 mb-4 w-full bg-gray-700 text-white rounded" type="text" placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input className="p-2 mb-4 w-full bg-gray-700 text-white rounded" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="w-full p-2 bg-green-500 text-white rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;
