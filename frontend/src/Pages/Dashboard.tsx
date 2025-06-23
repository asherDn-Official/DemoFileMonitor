import { ChevronDown, User } from "lucide-react";
import { SummaryCard } from "../components/SummaryCard";
import { DeviceCard } from "../components/DeviceCard";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const cardDetails = [
  {
    Deviceid: 123455,
    Connected: "no",
    Date: "2025-06-01T00:00:00.000Z",
    Time: "10:15 am",
    "operator 1": "Yes",
    Operator2: "No",
    Mat1: "No",
    Mat2: "NC",
  },
  {
    Deviceid: 987654,
    Connected: "no",
    Date: "2025-06-01T00:00:00.000Z",
    Time: "10:15 am",
    "operator 1": "Yes",
    Operator2: "No",
    Mat1: "No",
    Mat2: "NC",
  },
  {
    Deviceid: 298789,
    Connected: "yes",
    Date: "2025-07-01T00:00:00.000Z",
    Time: "10:15 am",
    "operator 1": "Yes",
    Operator2: "No",
    Mat1: "No",
    Mat2: "NC",
  },
  {
    Deviceid: 298790,
    Connected: "yes",
    Date: "2025-07-01T00:00:00.000Z",
    Time: "10:15 am",
    "operator 1": "Yes",
    Operator2: "No",
    Mat1: "No",
    Mat2: "NC",
  },
  {
    Deviceid: 298791,
    Connected: "yes",
    Date: "2025-07-01T00:00:00.000Z",
    Time: "10:15 am",
    "operator 1": "Yes",
    Operator2: "No",
    Mat1: "No",
    Mat2: "NC",
  },
  {
    Deviceid: 298792,
    Connected: "yes",
    Date: "2025-07-01T00:00:00.000Z",
    Time: "10:15 am",
    "operator 1": "Yes",
    Operator2: "No",
    Mat1: "No",
    Mat2: "NC",
  },
  {
    Deviceid: 298793,
    Connected: "no",
    Date: "2025-07-01T00:00:00.000Z",
    Time: "10:15 am",
    "operator 1": "Yes",
    Operator2: "No",
    Mat1: "No",
    Mat2: "NC",
  },
  {
    Deviceid: 298794,
    Connected: "no",
    Date: "2025-07-01T00:00:00.000Z",
    Time: "10:15 am",
    "operator 1": "Yes",
    Operator2: "No",
    Mat1: "No",
    Mat2: "NC",
  },
  {
    Deviceid: 298795,
    Connected: "yes",
    Date: "2025-07-01T00:00:00.000Z",
    Time: "10:15 am",
    "operator 1": "Yes",
    Operator2: "No",
    Mat1: "No",
    Mat2: "NC",
  },
  {
    Deviceid: 298796,
    Connected: "yes",
    Date: "2025-07-01T00:00:00.000Z",
    Time: "10:15 am",
    "operator 1": "Yes",
    Operator2: "No",
    Mat1: "No",
    Mat2: "NC",
  },
  {
    Deviceid: 298796,
    Connected: "fc",
    Date: "2025-07-01T00:00:00.000Z",
    Time: "10:45 am",
    "operator 1": "Yes",
    Operator2: "No",
    Mat1: "No",
    Mat2: "NC",
  },
];

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000, // 10 seconds timeout
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

      if (data.data?.length > 0) {
        setData(data.data[0].content);
        setLastUpdated(new Date().toLocaleTimeString("en-IN"));
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

    // Set up polling to refresh data every minute
    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  const totalDevices = data.length;
  const connectedDevices = data.filter(
    (d) => d.Connected && d.Connected.toLowerCase() === "yes"
  ).length;
  const failedDevices = data.filter(
    (d) => d.Connected && d.Connected.toLowerCase() === "fc"
  ).length;
  const notConnectedDevices = data.filter(
    (d) => d.Connected && d.Connected.toLowerCase() === "no"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#053183] text-white p-4 md:p-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-lg md:text-xl font-semibold">
            ESD Continuous monitoring Dashboard
          </h1>
          {/* <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center">
            <User className="w-4 h-4 md:w-6 md:h-6 text-blue-700" />
          </div> */}
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
            {/* Optional filters - commented out but made responsive */}
            {/* <div className="flex flex-col xs:flex-row gap-2 sm:gap-4 w-full xs:w-auto">
              <div className="relative flex-1 xs:flex-none">
                <select className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 md:px-4 md:py-2 pr-6 md:pr-8 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base">
                  <option>Date</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative flex-1 xs:flex-none">
                <select className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 md:px-4 md:py-2 pr-6 md:pr-8 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base">
                  <option>Shift</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-400 pointer-events-none" />
              </div>
            </div> */}
          </div>

          {/* Device Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4">
            {data.map((device, index) => (
              <DeviceCard key={index} device={device} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
