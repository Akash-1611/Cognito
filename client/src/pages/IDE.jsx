import { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import { executeCode, createRoom, joinRoom, saveCode, loadCode, getLastRoom } from "../utils/api";
import { io } from "socket.io-client";

const socket = io("https://cognito-0c7v.onrender.com");

const IDE = () => {
  const [code, setCode] = useState("// Start coding...");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [roomId, setRoomId] = useState(localStorage.getItem("roomId") || "");

  /** ✅ Fetch Last Active Room from MongoDB on Load */
  useEffect(() => {
    getLastRoom()
      .then((data) => {
        console.log("ℹ️ Last active room from DB:", data?.roomId);
        // ❌ Do not auto-set roomId here; just log it
      })
      .catch((err) => console.error("❌ Error fetching last room:", err));
  }, []);

  /** ✅ Rejoin Room on Refresh */
  useEffect(() => {
    if (roomId) {
      socket.emit("joinRoom", roomId);
      loadCode(roomId)
        .then((data) => {
          if (data) {
            setCode(data.code || "// Start coding...");
            setLanguage(data.language || "javascript");
          }
        })
        .catch((err) => console.error("❌ Error loading code:", err));
    }

    socket.on("codeUpdate", (newCode) => setCode(newCode));
    socket.on("outputUpdate", (newOutput) => setOutput(newOutput));

    return () => {
      socket.off("codeUpdate");
      socket.off("outputUpdate");
    };
  }, [roomId]);

  /** ✅ Auto-Save Code Every 1.5s */
  useEffect(() => {
    if (roomId) {
      const saveTimer = setTimeout(() => {
        saveCode({ roomId, code, language })
          .then(() => console.log("✅ Code saved successfully!"))
          .catch((err) => console.error("❌ Error saving code:", err));
      }, 1500);

      return () => clearTimeout(saveTimer);
    }
  }, [code, language, roomId]);

  /** ✅ Run Code */
  const runCode = async () => {
    try {
      const data = await executeCode({ code, language });
      setOutput(data.output);

      if (roomId) {
        socket.emit("updateOutput", { roomId, output: data.output });
      }
    } catch (error) {
      alert("⚠️ Failed to run code: " + (error.response?.data?.message || error.message));
    }
  };

  /** ✅ Handle Code Changes */
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (roomId) {
      socket.emit("updateCode", { roomId, code: newCode });
    }
  };

  /** ✅ Create Room */
  const handleCreateRoom = async () => {
    try {
      const { roomId } = await createRoom();
      if (roomId) {
        setRoomId(roomId);
        localStorage.setItem("roomId", roomId);
        alert(`✅ Room Created: ${roomId}`);
        socket.emit("createRoom", roomId);
      }
    } catch (error) {
      alert("⚠️ Failed to create room: " + (error.response?.data?.message || error.message));
    }
  };

  /** ✅ Join Room */
  const handleJoinRoom = async () => {
    if (!roomId.trim()) {
      return alert("⚠️ Please enter a valid Room ID before joining!");
    }

    try {
      const response = await joinRoom(roomId);
      if (response.success) {
        socket.emit("joinRoom", roomId);
        localStorage.setItem("roomId", roomId); // ✅ Store room ID
        alert(`✅ Successfully joined Room: ${roomId}`);
      }
    } catch (error) {
      alert("⚠️ Failed to join room: " + (error.response?.data?.message || error.message));
    }
  };

  /** ✅ Leave Room */
  const handleLeaveRoom = () => {
    socket.emit("leaveRoom", roomId);
    localStorage.removeItem("roomId"); // ✅ Remove from storage
    setRoomId(""); // Reset room ID
    setCode("// Start coding...");
    setOutput("");
    alert("🚪 Left the room.");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* ✅ Toolbar */}
      <div className="flex p-4 bg-gray-800">
        <select
          className="p-2 bg-gray-700 text-white"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
        <button className="ml-4 p-2 bg-green-500 text-white" onClick={runCode}>
          Run
        </button>
        <input
          className="ml-4 p-2 bg-gray-700 text-white"
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button className="ml-4 p-2 bg-blue-500 text-white" onClick={handleJoinRoom}>
          Join Room
        </button>
        <button className="ml-4 p-2 bg-purple-500 text-white" onClick={handleCreateRoom}>
          Create Room
        </button>
        {roomId && (
          <button className="ml-4 p-2 bg-red-500 text-white" onClick={handleLeaveRoom}>
            Leave Room
          </button>
        )}
      </div>

      {/* ✅ Code Editor */}
      <MonacoEditor height="60vh" theme="vs-dark" language={language} value={code} onChange={handleCodeChange} />

      {/* ✅ Output Panel */}
      <div className="bg-black text-white p-4">
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default IDE;
