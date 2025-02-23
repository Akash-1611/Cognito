import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { executeCode } from "../utils/api";

const Editor = () => {
  const [code, setCode] = useState("// Start coding...");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");

  const runCode = async () => {
    const { data } = await executeCode({ code, language });
    setOutput(data.output);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex p-2 bg-gray-800">
        <select className="p-2 bg-gray-700 text-white" onChange={(e) => setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="c++">C++</option>
        </select>
        <button className="ml-4 p-2 bg-green-500 text-white" onClick={runCode}>Run</button>
      </div>
      <MonacoEditor height="60vh" theme="vs-dark" language={language} value={code} onChange={(value) => setCode(value)} />
      <div className="bg-black text-white p-4">
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default Editor;
