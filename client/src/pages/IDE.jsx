import { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import { executeCode, createRoom, joinRoom, saveCode, loadCode, getLastRoom } from "../utils/api"; 
// ⬆️ Add a new API function `getLastRoom` to fetch the last active room from MongoDB

import { io } from "socket.io-client";

const socket = io("https://cognito-0c7v.onrender.com");

const IDE = () => {
  const [code, setCode] = useState("// Start coding...");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [roomId, setRoomId] = useState("");

  /** ✅ Fetch Last Active Room from MongoDB on Page Load */
  useEffect(() => {
    getLastRoom()
      .then((data) => {
        if (data?.roomId) {
          setRoomId(data.roomId);
        }
      })
      .catch((err) => console.error("❌ Error fetching last room:", err));
  }, []);

  /** ✅ Load Code from Database When Room is Joined */
  useEffect(() => {
    if (roomId) {
      loadCode(roomId)
        .then((data) => {
          if (data) {
            setCode(data.code || "// Start coding...");
            setLanguage(data.language || "javascript");
          }
        })
        .catch((err) => console.error("❌ Error loading code:", err));

      socket.emit("joinRoom", roomId);
    }

    socket.on("codeUpdate", (newCode) => {
      setCode(newCode);
    });

    socket.on("outputUpdate", (newOutput) => {
      setOutput(newOutput);
    });

    return () => {
      socket.off("codeUpdate");
      socket.off("outputUpdate");
    };
  }, [roomId]);

  /** ✅ Auto-Save Code Every 1.5s (Debounce) */
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
      const data = await createRoom();
      setRoomId(data.roomId);
      alert(`✅ Room Created: ${data.roomId}`);
      socket.emit("createRoom", data.roomId);
    } catch (error) {
      alert("⚠️ Failed to create room: " + (error.response?.data?.message || error.message));
    }
  };

  /** ✅ Join Room */
  const handleJoinRoom = async () => {
    if (!roomId) return alert("⚠️ Enter a Room ID!");

    try {
      await joinRoom(roomId);
      alert(`✅ Joined Room: ${roomId}`);
      socket.emit("joinRoom", roomId);
    } catch (error) {
      alert("⚠️ Failed to join room: " + (error.response?.data?.message || error.message));
    }
  };

  /** ✅ Leave Room */
  const handleLeaveRoom = () => {
    socket.emit("leaveRoom", roomId);
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
