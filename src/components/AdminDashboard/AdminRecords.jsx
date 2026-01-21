import { useState, useEffect } from "react";
import { adminService } from "../../services";
import "./AdminRecords.css";

function AdminRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  useEffect(() => {
    fetchRegistrations();
  }, [pagination.page, pagination.limit]);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await adminService.getRegistrations({
        page: pagination.page,
        limit: pagination.limit,
      });

     

      if (result.success && result.data) {
        const registrations = result.data.registrations || result.data.data || [];
       
        
        setRecords(registrations);
        setFilteredRecords(registrations);
        
        // Get total from backend response - check multiple possible locations
        const total = result.data.total || 
                     result.data.pagination?.total || 
                     result.data.totalCount ||
                     result.data.count ||
                     registrations.length;
        
        setPagination(prev => ({
          ...prev,
          total: total,
        }));
      } else {
        setError(result.error || "Failed to fetch registrations");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = records.filter(
      (record) =>
        record.firstName?.toLowerCase().includes(term) ||
        record.surname?.toLowerCase().includes(term) ||
        record.guardianPhoneNumber?.includes(term) ||
        record.email?.toLowerCase().includes(term)
    );

    setFilteredRecords(filtered);
  };

  const handleExport = async () => {
    try {
      const result = await adminService.exportRecords();
      if (result.success) {
        // Handle CSV download
        const blob = new Blob([result.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div className="records-container">
      <div className="records-header">
        <h2>Registered Applicants</h2>
        <p>Total Records: {pagination.total}</p>
        <button onClick={handleExport} className="export-btn">
          Export CSV
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search by name, phone, or email..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
          aria-label="Search records"
        />
        <div className="records-per-page">
          <label htmlFor="limit">Records per page:</label>
          <select
            id="limit"
            value={pagination.limit}
            onChange={(e) => setPagination(prev => ({ ...prev, limit: Number(e.target.value), page: 1 }))}
            className="limit-select"
          >
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="500">500</option>
          </select>
        </div>
      </div>

      {loading && <div className="loading">Loading registrations...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <>
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
                  <th scope="col">Email</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record, index) => (
                    <tr key={record._id || record.id || index}>
                      <td>{record._id?.slice(-6) || index + 1}</td>
                      <td>{record.firstName}</td>
                      <td>{record.surname}</td>
                      <td>{record.sex}</td>
                      <td>{record.age}</td>
                      <td>{record.positionOfPlay || 'N/A'}</td>
                      <td>{record.guardianPhoneNumber}</td>
                      <td>{record.email}</td>
                      <td>
                        <span className={`status-badge ${(record.paymentStatus || record.status || 'pending').toLowerCase()}`}>
                          {record.paymentStatus || record.status || 'PENDING'}
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

          {/* Pagination Controls */}
          {pagination.total > pagination.limit && (
            <div className="pagination">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                {' '}({pagination.total} total records)
              </span>
              
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminRecords;
