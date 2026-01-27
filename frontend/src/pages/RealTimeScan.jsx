export default function RealTimeScan() {
  return (
    <div className="container mt-4">
      <h1 className="fw-bold mb-4">Real-Time Intrusion Scan</h1>

      <div className="card text-white bg-dark border-secondary p-4">
        <button className="btn btn-success fw-bold">
          Start Scan
        </button>

        <div className="mt-4 p-3 border border-secondary rounded" style={{ height: "16rem", overflowY: "auto" }}>
          <p className="text-secondary mb-0">Waiting for packets...</p>
        </div>
      </div>
    </div>
  );
}
