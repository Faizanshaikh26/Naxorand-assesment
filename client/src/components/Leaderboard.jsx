import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import DataDisplay from "./DataDisplay";
import { server } from "../constants/server";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [todayPoints, setTodayPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${server}/api/user/v1/get-users`);
      const usersData = response.data.data;

      if (Array.isArray(usersData)) {
        const sortedUsers = usersData.sort((a, b) => b.Points - a.Points);
        setUsers(sortedUsers);
      } else {
        console.error("Expected an array for users, but received:", usersData);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(`Error fetching users: ${error.response?.data?.message || error.message}`);
    }
  };

  const fetchUserPoints = async () => {
    try {
      const email = localStorage.getItem("email");
      if (!email) throw new Error("Email not found in local storage.");

      const response = await axios.post(`${server}/api/user/v1/your-history`, { email });
      if (!response.data.success) throw new Error(response.data.message || "Failed to fetch user history.");

      const historyData = response.data.data;
      const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(",", "");

      let todayPoints = 0, totalPoints = 0;
      historyData.forEach(item => {
        totalPoints += item.pointsAwarded;
        if (item.date === today) todayPoints += item.pointsAwarded;
      });

      setTodayPoints(todayPoints);
      setTotalPoints(totalPoints);
    } catch (error) {
      console.error("Error fetching user points:", error);
      toast.error(`Error fetching user points: ${error.message}`);
    }
  };

  const claimPoints = async (username) => {
    try {
      const response = await axios.patch(`${server}/api/user/v1/claim-points`, { username });
      toast.success(`${response.data.message} for ${username}`);
      getAllUsers();
    } catch (error) {
      console.error("Error claiming points:", error);
      toast.error(`Error claiming points: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    getAllUsers();
    fetchUserPoints();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="py-4 px-6 md:px-[130px]">
        <div className="w-full h-full bg-gray-200">
          <nav className="bg-blue-600 h-[80px] flex justify-between items-center px-4 text-white">
            <div className="flex flex-col">
              <span>{todayPoints} Today</span>
              <span>₹ {totalPoints.toFixed(2)}</span>
            </div>
            <div className="flex items-center">
              <span>Leaderboard</span>
              <i className="fa-solid fa-chess-king ml-2"></i>
            </div>
          </nav>

          <DataDisplay />

          {users.map((data, index) => (
            <div
              className="flex items-center justify-between bg-gray-200 p-4 rounded mb-2 mt-3 hover:bg-gray-300 transition"
              key={data._id}
              onClick={() => claimPoints(data.username)}
            >
              <div className="flex items-center">
                <i className="fa-solid fa-user mr-2"></i>
                <div className="flex flex-col">
                  <p className="font-semibold">{data.username}</p>
                  <span className="text-gray-600">Rank: {index + 1}</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-semibold text-orange-500">Prize: {data.Points}</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-semibold text-green-500">{data.Points}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Leaderboard;
