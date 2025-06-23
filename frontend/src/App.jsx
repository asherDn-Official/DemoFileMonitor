
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/data");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      
      if (json.success && json.data?.length > 0) {
        const contentArray = json.data[0].content;
        setRecords(contentArray);
        setLastUpdated(new Date().toLocaleTimeString("en-IN"));
        setError(null);
      } else {
        setError("No valid data received from server");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const getColorClass = (value) => {
    if (!value) return "";
    const val = value.toString().toLowerCase();
    if (val === "yes") return "status-green";
    if (val === "no") return "status-red";
    if (val === "nc") return "status-orange";
    return "";
  };

  const formatDate = (dateString) => {
    try {
      const [day, month, year] = dateString.split("-");
      const date = new Date(`${year}-${month}-${day}`);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes);
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timeString;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Device Status Monitor</h1>
        {lastUpdated && (
          <p className="last-updated">Last updated: {lastUpdated}</p>
        )}
      </header>

      <main className="app-content">
        {error ? (
          <div className="error-message">{error}</div>
        ) : loading ? (
          <div className="loading-spinner"></div>
        ) : records.length === 0 ? (
          <p className="no-records">No records found.</p>
        ) : (
          <div className="device-grid">
            {records.map((device, index) => (
              <div key={`${device.Deviceid}-${index}`} className="device-card">
                <h2 className="device-id">Device ID: {device.Deviceid}</h2>
                <div className="device-details">
                  {Object.entries(device).map(([key, value]) => {
                    if (key.toLowerCase() === "deviceid") return null;

                    let displayValue = value;
                    const lowerKey = key.toLowerCase();

                    if (lowerKey === "date") {
                      displayValue = formatDate(value);
                    } else if (lowerKey === "time") {
                      displayValue = formatTime(value);
                    }

                    return (
                      <div key={key} className="detail-row">
                        <span className="detail-label">{key}:</span>
                        <span className={`detail-value ${getColorClass(value)}`}>
                          {displayValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;