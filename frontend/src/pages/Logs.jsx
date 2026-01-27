export default function Logs() {
  return (
    <div className="container mt-4">
      <h1 className="mb-4 fw-bold">Intrusion Logs</h1>

      <div className="table-responsive">
        <table className="table table-dark table-striped table-bordered rounded">
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Protocol</th>
              <th scope="col">Source</th>
              <th scope="col">Destination</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>12:30 PM</td>
              <td>TCP</td>
              <td>192.168.1.10</td>
              <td>172.217.2.14</td>
              <td className="text-danger">Threat</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
