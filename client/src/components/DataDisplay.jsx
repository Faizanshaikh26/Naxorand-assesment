import { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../constants/server";

const DataDisplay = () => {
  // State for selected period and data
  const [selectedPeriod, setSelectedPeriod] = useState("daily");
  const [data, setData] = useState([]);

  // Fetch data based on selected period
  const fetchData = async (period) => {
    let url;
    switch (period) {
      case "daily":
        url = `${server}/api/user/v1/your-daily-history`;
        break;
      case "weekly":
        url = `${server}/api/user/v1/your-weekly-history`;
        break;
      case "monthly":
        url = `${server}/api/user/v1/your-monthly-history`;
        break;
      default:
        return;
    }

    try {
      const response = await axios.get(url);
      setData(response.data.data); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data when selectedPeriod changes
  useEffect(() => {
    fetchData(selectedPeriod);
  }, [selectedPeriod]);

  // Button click handler
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  return (
    <div>
      <div className="flex justify-center mt-5 mb-3 flex-wrap">
        <div className="flex items-center space-x-4">
          <button
            className={`${
              selectedPeriod === "daily" ? "bg-orange-600 text-white" : "bg-gray-300 text-cyan-950"
            } font-semibold py-2 px-4 rounded-full w-full sm:w-[120px] hover:bg-red-600 hover:text-white transition duration-300`}
            onClick={() => handlePeriodChange("daily")}
          >
            Daily
          </button>
          <button
            className={`${
              selectedPeriod === "weekly" ? "bg-orange-600 text-white" : "bg-gray-300 text-cyan-950"
            } font-semibold py-2 px-4 rounded-full w-full sm:w-[120px] hover:bg-red-600 hover:text-white transition duration-300`}
            onClick={() => handlePeriodChange("weekly")}
          >
            Weekly
          </button>
          <button
            className={`${
              selectedPeriod === "monthly" ? "bg-orange-600 text-white" : "bg-gray-300 text-cyan-950"
            } font-semibold py-2 px-4 rounded-full w-full sm:w-[120px] hover:bg-red-600 hover:text-white transition duration-300`}
            onClick={() => handlePeriodChange("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-between mx-[40px] mt-[30px]">
        {data.length > 0 ? (
          data.map((entry, index) => (
            <div key={index} className="flex flex-col p-4 rounded shadow-md">
              <span>{entry._id || entry.username}</span>
              <span>{entry.totalPointsAwarded || entry.totalPoints}</span>
              <span className="text-orange-500">
                Prize: {entry.totalPointsAwarded || entry.totalPoints}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center w-full">No data available for this period.</p>
        )}
      </div>
    </div>
  );
};

export default DataDisplay;
