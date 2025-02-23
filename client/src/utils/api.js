import axios from "axios";

const API = axios.create({ baseURL: "https://cognito-0c7v.onrender.com" });

// ✅ Attach Authorization Token to Requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
    req.headers["Content-Type"] = "application/json"; // ✅ Ensure JSON format
  }
  return req;
});

// ✅ Handle Unauthorized Responses (Token Expired, Invalid)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Token expired or invalid. Logging out...");
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

// ✅ Authentication APIs
export const login = async (data) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const register = async (data) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

// ✅ Code Execution API
export const executeCode = async (data) => {
  const response = await API.post("/execute/run", data);
  return response.data;
};

// ✅ Collaboration APIs
export const createRoom = async () => {
  const response = await axios.post("https://cognito-0c7v.onrender.com/collab/create-room", {}, {
    headers: { "Content-Type": "application/json" }, // ✅ Remove Authorization
  });
  return response.data;
};


export const joinRoom = async (roomId) => {
  const response = await API.post("/collab/join-room", { roomId });
  return response.data;
};

// ✅ Fix Save Code API (Matches Backend `/code/save`)
export const loadCode = async (roomId) => {
  const response = await API.get(`/code/load/${roomId}`);
  return response.data;
};


// ✅ Save Code API (POST)
export const saveCode = async ({ roomId, code, language }) => {
  const response = await API.post(`/code/save`, { roomId, code, language });
  return response.data;
};
export const getLastRoom = async () => {
  const response = await API.get("/api/last-room");
  return response.data;
};



// ✅ Logout API
export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export default API;