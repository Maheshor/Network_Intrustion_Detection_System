import { useState } from "react";

export default function ManualCheck() {
  const [form, setForm] = useState({
    duration: "",
    protocol_type: "",
    service: "",
    flag: "",
    src_bytes: "",
    dst_bytes: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Manual Check Input:", form);
    // Later → Send to ML backend
  };

  return (
    // ✅ Full screen center wrapper
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      
      <div className="w-full max-w-3xl bg-[#111] p-8 rounded-xl border border-gray-800">
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">
          Manual Intrusion Check
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 text-sm">

          <input
            name="duration"
            placeholder="Duration"
            onChange={handleChange}
            className="input"
          />

          <input
            name="protocol_type"
            placeholder="Protocol (tcp)"
            onChange={handleChange}
            className="input"
          />

          <input
            name="service"
            placeholder="Service"
            onChange={handleChange}
            className="input"
          />

          <input
            name="flag"
            placeholder="Flag"
            onChange={handleChange}
            className="input"
          />

          <input
            name="src_bytes"
            placeholder="Source Bytes"
            onChange={handleChange}
            className="input"
          />

          <input
            name="dst_bytes"
            placeholder="Destination Bytes"
            onChange={handleChange}
            className="input"
          />

          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 p-3 rounded font-bold text-black"
            >
              Check Intrusion
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
