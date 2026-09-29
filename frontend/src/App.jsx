import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/api/buses/";

function App() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [selectedBus, setSelectedBus] = useState(null);

  // Form data
  const [busNumber, setBusNumber] = useState("");
  const [driverName, setDriverName] = useState("");

  // ============================
  // GET ALL BUSES
  // ============================
  const fetchBuses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);

      setBuses(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load buses. Please check Django server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  // ============================
  // OPEN ADD MODAL
  // ============================
  const openAddModal = () => {
    setBusNumber("");
    setDriverName("");
    setShowAddModal(true);
  };

  // ============================
  // ADD BUS
  // ============================
  const addBus = async (e) => {
    e.preventDefault();

    if (!busNumber.trim() || !driverName.trim()) {
      alert("Please enter bus number and driver name.");
      return;
    }

    try {
      await axios.post(API_URL, {
        bus_number: busNumber,
        driver_name: driverName,
      });

      setShowAddModal(false);

      setBusNumber("");
      setDriverName("");

      fetchBuses();
    } catch (err) {
      console.error(err);
      alert("Failed to add bus.");
    }
  };

  // ============================
  // VIEW DETAILS
  // ============================
  const viewDetails = (bus) => {
    setSelectedBus(bus);
    setShowDetailsModal(true);
  };

  // ============================
  // OPEN EDIT
  // ============================
  const openEditModal = (bus) => {
    setSelectedBus(bus);

    setBusNumber(bus.bus_number);
    setDriverName(bus.driver_name);

    setShowEditModal(true);
  };

  // ============================
  // UPDATE BUS
  // ============================
  const updateBus = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(`${API_URL}${selectedBus.id}/`, {
        bus_number: busNumber,
        driver_name: driverName,
      });

      setShowEditModal(false);

      setSelectedBus(null);

      fetchBuses();
    } catch (err) {
      console.error(err);
      alert("Failed to update bus.");
    }
  };

  // ============================
  // DELETE BUS
  // ============================
  const deleteBus = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bus?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${API_URL}${id}/`);

      fetchBuses();
    } catch (err) {
      console.error(err);
      alert("Failed to delete bus.");
    }
  };

  // ============================
  // UI
  // ============================
  return (
    <div className="app">

      {/* ================= HEADER ================= */}
      <header className="topbar">

        <div className="brand">
          <div className="brand-icon">🚌</div>

          <div>
            <h1>School Transport</h1>
            <p>Bus Management System</p>
          </div>
        </div>

        <button className="add-button" onClick={openAddModal}>
          <span>+</span>
          Add New Bus
        </button>

      </header>


      {/* ================= MAIN ================= */}
      <main className="main-container">

        {/* Page heading */}

        <div className="page-heading">

          <div>
            <h2>Bus Management</h2>

            <p>
              Manage and monitor all school buses
            </p>
          </div>

          <div className="bus-count">
            <span>{buses.length}</span>
            <small>Total Buses</small>
          </div>

        </div>


        {/* Error */}

        {error && (
          <div className="error-box">
            ⚠️ {error}
          </div>
        )}


        {/* Loading */}

        {loading ? (

          <div className="loading">
            <div className="spinner"></div>
            <p>Loading buses...</p>
          </div>

        ) : buses.length === 0 ? (

          /* Empty state */

          <div className="empty-state">

            <div className="empty-icon">
              🚌
            </div>

            <h3>No buses found</h3>

            <p>
              Start by adding your first school bus.
            </p>

            <button
              className="add-button"
              onClick={openAddModal}
            >
              + Add New Bus
            </button>

          </div>

        ) : (

          /* ================= BUS GRID ================= */

          <div className="bus-grid">

            {buses.map((bus, index) => (

              <div className="bus-card" key={bus.id}>

                {/* Card top */}

                <div className="card-top">

                  <div className="bus-icon">
                    🚌
                  </div>

                  <span className="bus-status">
                    Active
                  </span>

                </div>


                {/* Bus number */}

                <div className="bus-number">
                  {bus.bus_number}
                </div>


                {/* Driver */}

                <div className="driver-info">

                  <div className="driver-avatar">
                    👨‍✈️
                  </div>

                  <div>
                    <span className="label">
                      Driver
                    </span>

                    <strong>
                      {bus.driver_name}
                    </strong>
                  </div>

                </div>


                {/* Card footer */}

                <div className="card-footer">

                  <button
                    className="view-btn"
                    onClick={() => viewDetails(bus)}
                  >
                    👁 View
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() => openEditModal(bus)}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteBus(bus.id)}
                  >
                    🗑 Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>


      {/* =================================================
          ADD BUS MODAL
      ================================================= */}

      {showAddModal && (

        <div
          className="modal-overlay"
          onClick={() => setShowAddModal(false)}
        >

          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div>
                <h2>Add New Bus</h2>
                <p>Add a school bus to the system</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>

            </div>


            <form onSubmit={addBus}>

              <div className="form-group">

                <label>
                  Bus Number
                </label>

                <input
                  type="text"
                  placeholder="Example: MH12AB1234"
                  value={busNumber}
                  onChange={(e) =>
                    setBusNumber(e.target.value)
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Driver Name
                </label>

                <input
                  type="text"
                  placeholder="Example: Rahul"
                  value={driverName}
                  onChange={(e) =>
                    setDriverName(e.target.value)
                  }
                />

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  + Add Bus
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =================================================
          EDIT BUS MODAL
      ================================================= */}

      {showEditModal && (

        <div
          className="modal-overlay"
          onClick={() => setShowEditModal(false)}
        >

          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div>
                <h2>Edit Bus</h2>
                <p>Update bus information</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>

            </div>


            <form onSubmit={updateBus}>

              <div className="form-group">

                <label>
                  Bus Number
                </label>

                <input
                  type="text"
                  value={busNumber}
                  onChange={(e) =>
                    setBusNumber(e.target.value)
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Driver Name
                </label>

                <input
                  type="text"
                  value={driverName}
                  onChange={(e) =>
                    setDriverName(e.target.value)
                  }
                />

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  Save Changes
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =================================================
          VIEW DETAILS MODAL
      ================================================= */}

      {showDetailsModal && selectedBus && (

        <div
          className="modal-overlay"
          onClick={() => setShowDetailsModal(false)}
        >

          <div
            className="details-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="details-header">

              <div className="details-bus-icon">
                🚌
              </div>

              <div>

                <span>Bus Details</span>

                <h2>
                  {selectedBus.bus_number}
                </h2>

              </div>

              <button
                className="close-button"
                onClick={() => setShowDetailsModal(false)}
              >
                ×
              </button>

            </div>


            <div className="details-body">

              <div className="detail-item">

                <span>
                  Bus Number
                </span>

                <strong>
                  {selectedBus.bus_number}
                </strong>

              </div>


              <div className="detail-item">

                <span>
                  Driver
                </span>

                <strong>
                  {selectedBus.driver_name}
                </strong>

              </div>


              <div className="detail-item">

                <span>
                  Bus ID
                </span>

                <strong>
                  #{selectedBus.id}
                </strong>

              </div>


              <div className="detail-item">

                <span>
                  Status
                </span>

                <strong className="active-text">
                  ● Active
                </strong>

              </div>

            </div>


            <div className="details-footer">

              <button
                className="edit-large-btn"
                onClick={() => {
                  setShowDetailsModal(false);
                  openEditModal(selectedBus);
                }}
              >
                ✏️ Edit Bus
              </button>

              <button
                className="close-details-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;