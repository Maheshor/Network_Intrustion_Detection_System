import { useState } from "react";

export default function ManualCheck() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleCheck = () => {
    // Dummy logic (you can replace with API later)
    if (input.trim() === "") return;

    const random = Math.random();

    if (random > 0.5) {
      setResult({
        label: "THREAT",
        confidence: (random * 100).toFixed(2),
      });
    } else {
      setResult({
        label: "NORMAL",
        confidence: (random * 100).toFixed(2),
      });
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🔍 Manual Packet Check</h2>

      {/* INPUT */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter packet data or IP..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {/* BUTTON */}
      <button className="btn btn-primary" onClick={handleCheck}>
        Check
      </button>

      {/* RESULT */}
      {result && (
        <div
          className={`mt-4 p-3 rounded text-white ${
            result.label === "THREAT" ? "bg-danger" : "bg-success"
          }`}
        >
          <h5>Result: {result.label}</h5>
          <p>Confidence: {result.confidence}%</p>
        </div>
      )}
    </div>
  );
}