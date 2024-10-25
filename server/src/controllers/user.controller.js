import User from "../models/users.model.js";
import { format } from "date-fns";
import ClaimHistory from "../models/claimsHistory.model.js";

export const getAllUser = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: allUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const claimPoints = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Username not found. If you are not registered, please register first.",
      });
    }

    const pointsAwarded = Math.floor(Math.random() * 10) + 1;

    user.Points += pointsAwarded;
    await user.save();

    await ClaimHistory.create({
      userId: user._id,
      pointsAwarded,
      username,
    });

    res.status(200).json({
      success: true,
      message: `${pointsAwarded} points claimed successfully!`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getTodayHistory = async (req, res) => {
  try {
    const today = new Date();
    const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
    const todayStart = new Date(today.setUTCHours(0, 0, 0, 0) + istOffset);
    const todayEnd = new Date(today.setUTCHours(23, 59, 59, 999) + istOffset);

    const todayData = await ClaimHistory.aggregate([
      {
        $match: {
          createdAt: {
            $gte: todayStart,
            $lt: todayEnd,
          },
        },
      },
      {
        $group: {
          _id: "$username",
          totalPointsAwarded: { $sum: "$pointsAwarded" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Today's history fetched successfully.",
      data: todayData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

export const getWeeklyData = async (req, res) => {
  try {
    const currentDate = new Date();
    const lastMonday = new Date();
    lastMonday.setDate(currentDate.getDate() - ((currentDate.getDay() + 6) % 7));

    const weeklyData = await ClaimHistory.aggregate([
      {
        $match: {
          createdAt: {
            $gte: lastMonday,
            $lt: new Date(currentDate.setDate(currentDate.getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: "$username",
          totalPoints: { $sum: "$pointsAwarded" },
        },
      },
    ]);

    weeklyData.sort((a, b) => b.totalPoints - a.totalPoints);

    res.status(200).json({
      success: true,
      message: "Weekly data fetched successfully.",
      data: weeklyData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

export const getMonthlyData = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const monthlyData = await ClaimHistory.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: "$username",
          totalPointsAwarded: { $sum: "$pointsAwarded" },
        },
      },
    ]);

    monthlyData.sort((a, b) => b.totalPointsAwarded - a.totalPointsAwarded);

    res.status(200).json({
      success: true,
      message: "Monthly data fetched successfully.",
      data: monthlyData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

export const getUserHistory = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const history = await ClaimHistory.find({ userId: user._id });

    const formattedHistory = history.map((entry) => {
      const createdAt = entry.createdAt
        ? format(new Date(entry.createdAt), "dd MMM yyyy")
        : "Invalid date";

      return {
        pointsAwarded: entry.pointsAwarded,
        date: createdAt,
      };
    });

    res.status(200).json({
      success: true,
      message: "User history fetched successfully.",
      data: formattedHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

export const getUserWithHelpOfToken = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully.",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

export const getUserWithHelpOfId = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully.",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};
