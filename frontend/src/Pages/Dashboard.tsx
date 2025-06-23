import { ChevronDown } from "lucide-react";
import { SummaryCard } from "../components/SummaryCard";
import { DeviceCard } from "../components/DeviceCard";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

export const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/data");
      const { data } = response;

      if (!data.success) {
        throw new Error("API request was not successful");
      }

      if (Array.isArray(data.data)) {
        setData(data.data);
        setLastUpdated(new Date().toLocaleTimeString("en-IN"));
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 2000); // Poll every 60 sec
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const totalDevices = data.length;
  const connectedDevices = data.filter(
    (d) => d.Connected?.toLowerCase() === "yes"
  ).length;
  const failedDevices = data.filter(
    (d) => d.Connected?.toLowerCase() === "fc"
  ).length;
  const notConnectedDevices = data.filter(
    (d) => d.Connected?.toLowerCase() === "no"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#053183] text-white p-4 md:p-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-lg md:text-xl font-semibold">
            ESD Continuous monitoring Dashboard
          </h1>
        </div>
      </div>

      <div className="px-4 md:px-6 py-4 space-y-6 ">
        {/* Summary Cards */}
        <div className="flex flex-wrap gap-3 md:gap-4 max-w-7xl justify-center items-center mx-auto">
          <SummaryCard
            count={totalDevices}
            label="Total"
            bgColor="bg-[#4019CD1A]"
            textColor="text-[#4019CD]"
          />
          <SummaryCard
            count={connectedDevices}
            label="Connected"
            bgColor="bg-[#19CD401A]"
            textColor="text-[#19CD40]"
          />
          <SummaryCard
            count={notConnectedDevices}
            label="Not Connected"
            bgColor="bg-[#D20C2D1A]"
            textColor="text-[#D20C2D]"
          />
          <SummaryCard
            count={failedDevices}
            label="Failed Connected"
            bgColor="bg-[#ECA2031A]"
            textColor="text-[#ECA203]"
          />
        </div>

        {/* Production Line Overview */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2  max-w-7xl mx-auto">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 ">
              Production Line Overview:
            </h2>
          </div>

          {/* Feedback */}
          {loading && (
            <p className="text-center text-sm text-gray-500">Loading...</p>
          )}
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          {!loading && data.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              No device data available.
            </p>
          )}

          {/* Device Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4">
            {data.map((device, index) => (
              <DeviceCard
                key={index}
                device={{
                  Deviceid: device.DeviceID,
                  Connected: device.Connected,
                  Date: device.Date,
                  Time: device.Time,
                  "operator 1": device.Operator1,
                  Operator2: device.Operator2,
                  Mat1: device.Mat1,
                  Mat2: device.Mat2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
