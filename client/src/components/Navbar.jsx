import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/"); // Redirect to home after logout
  };

  return (
    <nav className="flex justify-between p-4 bg-gray-800 text-white">
      <Link to="/" className="text-lg font-bold">Cognito⚡</Link>
      <div>
        {isAuthenticated ? (
          <button className="bg-red-500 px-4 py-2 rounded" onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/register" className="bg-blue-500 px-4 py-2 rounded">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
