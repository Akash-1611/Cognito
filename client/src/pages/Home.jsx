import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Collaborative IDE</h1>
      <p className="text-gray-400 mb-6">Write, run, and collaborate on code in real time.</p>
      <button onClick={() => navigate("/ide")} className="bg-blue-500 px-6 py-2 text-white rounded">Go to IDE</button>
    </div>
  );
};

export default Home;
