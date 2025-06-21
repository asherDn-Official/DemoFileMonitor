// src/App.jsx
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:5000/api/data")
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data.length > 0) {
            const contentArray = json.data[0].content;
            console.log("contentarray",contentArray);
            setRecords(contentArray);
            setLastUpdated(new Date().toLocaleTimeString("en-IN"));
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setLoading(false);
        });
    };

    fetchData();
    const intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const getColorClass = (value) => {
    if (!value) return "";
    const val = value.toString().toLowerCase();
    if (val === "yes") return "green";
    if (val === "no") return "red";
    if (val === "nc") return "orange";
    return ""; // Don't color date/time/etc.
  };

  return (
    <div className="container">
      <h1>Device Status Monitor</h1>
      {lastUpdated && <p>Last updated at: {lastUpdated}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div className="grid">
          {records.map((device, index) => (
            <div key={index} className="card">
              <h2>Device ID: {device.Deviceid}</h2>
              {Object.entries(device).map(([key, value]) => {
                if (key.toLowerCase() === "deviceid") return null;

                const lowerKey = key.toLowerCase();
                let displayValue = value;

                // Format date (from "dd-mm-yyyy" to "01 Jun 2025")
                if (lowerKey === "date") {
                  const parsedDate = new Date(value);
                  if (!isNaN(parsedDate)) {
                    displayValue = parsedDate.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });
                  } else {
                    displayValue = "Invalid Date";
                  }
                }

                // Format time (from "HH:mm:ss" to "hh:mm AM/PM")
                if (lowerKey === "time" && typeof value === "string") {
                  const [hours, minutes] = value.split(":");
                  const date = new Date();
                  date.setHours(parseInt(hours), parseInt(minutes));
                  displayValue = date.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });
                }

                return (
                  <p key={key}>
                    <span className="label">{key}:</span>
                    <span className={`value ${getColorClass(value)}`}>
                      {displayValue}
                    </span>
                  </p>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
