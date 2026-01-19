import { useState } from "react";
import { MOCK_RECORDS } from "../../constants/admin";
import "./AdminRecords.css";

function AdminRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecords, setFilteredRecords] = useState(MOCK_RECORDS);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = MOCK_RECORDS.filter(
      (record) =>
        record.firstName.toLowerCase().includes(term) ||
        record.surname.toLowerCase().includes(term) ||
        record.guardianPhone.includes(term)
    );

    setFilteredRecords(filtered);
  };

  return (
    <div className="records-container">
      <div className="records-header">
        <h2>Registered Applicants</h2>
        <p>Total Records: {MOCK_RECORDS.length}</p>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search by name or phone number..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
          aria-label="Search records"
        />
      </div>

      <div className="records-table-wrapper">
        <table className="records-table" role="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">First Name</th>
              <th scope="col">Surname</th>
              <th scope="col">Sex</th>
              <th scope="col">Age</th>
              <th scope="col">Position</th>
              <th scope="col">Guardian Phone</th>
              <th scope="col">Registered Date</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>{record.firstName}</td>
                  <td>{record.surname}</td>
                  <td>{record.sex}</td>
                  <td>{record.age}</td>
                  <td>{record.position}</td>
                  <td>{record.guardianPhone}</td>
                  <td>{record.registeredDate}</td>
                  <td>
                    <span className={`status-badge ${record.status.toLowerCase()}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-records">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminRecords;
