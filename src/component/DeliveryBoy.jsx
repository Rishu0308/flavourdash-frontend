import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import Nav from "./Nav";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";

function DeliveryBoy() {
  const { userData, socket } = useSelector((state) => state.user);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [otp, setOtp] = useState("");
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState({});
  const [chartType, setChartType] = useState("today");
  const [chartData, setChartData] = useState([]);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [loading, setLoading] = useState(false);

  const ratePerDelivery = 50;
  const totalEarning = Array.isArray(chartData)
    ? chartData.reduce(
      (sum, d) => sum + (d.count || d.deliveries || 0) * ratePerDelivery,
      0
    )
    : 0;

  // ✅ Track live location
  useEffect(() => {
    if (!socket || userData.role !== "deliveryboy") return;

    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDeliveryBoyLocation({ lat: latitude, lon: longitude });
          socket.emit("updateLocation", {
            latitude,
            longitude,
            userId: userData._id,
          });
        },
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, userData]);

  // ✅ Fetch available assignments
  const getAssignments = async () => {
    try {
      setAssignmentsLoading(true);
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, {
        withCredentials: true,
      });
      setAvailableAssignments(result.data || []);
    } catch (error) {
      console.error("getAssignments error:", error);
    } finally {
      setAssignmentsLoading(false);
    }
  };

  // ✅ Fetch current order
  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-current-order`, {
        withCredentials: true,
      });
      setCurrentOrder(result.data || null);
    } catch (error) {
      console.error("Get current order error:", error);
    } finally {
      setLoadingOrder(false);
    }
  };

  // ✅ Accept order
  const acceptOrder = async (assignmentID) => {
    if (!assignmentID) return toast.error("Invalid assignment ID");
    try {
      await axios.get(`${serverUrl}/api/order/accept-order/${assignmentID}`, {
        withCredentials: true,
      });
      await Promise.all([getCurrentOrder(), getAssignments()]);
      toast.success("Order accepted successfully!");
    } catch (error) {
      console.error("Accept order error:", error);
      toast.error("Failed to accept order.");
    }
  };

  // ✅ Send OTP
  const sendOtp = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/order/send-delivery-otp/`,
        {
          orderId: currentOrder?._id,
          shopOrderId: currentOrder?.shopOrder?._id,
        },
        { withCredentials: true }
      );
      setShowOtpBox(true);
      toast.info("📨 OTP sent to customer!");
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error("Failed to send OTP!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const verifyOtp = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/order/verify-delivery-otp/`,
        {
          orderId: currentOrder?._id,
          shopOrderId: currentOrder?.shopOrder?._id,
          otp,
        },
        { withCredentials: true }
      );
      toast.success("✅ Delivery completed!");
      setOtp("");
      setShowOtpBox(false);
      setCurrentOrder(null);
      await Promise.all([getAssignments(), getCurrentOrder()]);
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast.error("❌ Invalid OTP!");
    }
  };

  // ✅ Fetch analytics chart data
  const fetchChartData = async () => {
    try {
      let endpoint = "";
      if (chartType === "today") endpoint = "/api/order/get-today-deliveries";
      else if (chartType === "week") endpoint = "/api/order/get-weekly-deliveries";
      else endpoint = "/api/order/get-monthly-deliveries";

      const result = await axios.get(`${serverUrl}${endpoint}`, {
        withCredentials: true,
      });
      setChartData(result.data || []);
    } catch (error) {
      console.error("fetchChartData error:", error);
      toast.error("Failed to fetch analytics data.");
    }
  };

  useEffect(() => {
    getAssignments();
    getCurrentOrder();
    fetchChartData();
  }, []);

  useEffect(() => {
    fetchChartData();
  }, [chartType]);

  useEffect(() => {
    const interval = setInterval(() => getAssignments(), 30000);
    return () => clearInterval(interval);
  }, []);

  const chartLabel =
    chartType === "today"
      ? "Today's Deliveries"
      : chartType === "week"
        ? "Weekly Deliveries"
        : "Monthly Deliveries";

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-orange-100 via-white to-orange-50 relative overflow-x-hidden">
      <ToastContainer />
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Nav />
      </div>

      <div className="flex justify-center py-20 px-4">
        <div className="max-w-4xl w-full flex flex-col gap-10">
          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 text-center border border-orange-200"
          >
            <h1 className="text-4xl font-bold text-orange-500 drop-shadow-sm">
              👋 Hi, {userData?.fullName || "Delivery Partner"}
            </h1>
            <p className="text-gray-700 mt-3 flex items-center justify-center gap-2">
              <span className="font-semibold">Role:</span>
              <span className="px-3 py-1 bg-linear-to-r from-orange-400 to-pink-500 text-white rounded-full shadow-sm text-sm font-medium flex items-center gap-1">
                Delivery Boy
              </span>
            </p>
          </motion.div>

          {/* Deliveries Overview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-md border border-orange-100 rounded-3xl shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-orange-600 flex items-center gap-2">
                📊 {chartLabel}
              </h2>
              <div className="flex gap-2">
                {["today", "week", "month"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all ${chartType === type
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white text-orange-600 border-orange-300 hover:bg-orange-100"
                      }`}
                  >
                    {type === "today"
                      ? "Today"
                      : type === "week"
                        ? "Week"
                        : "Month"}
                  </button>
                ))}
              </div>
            </div>

            {chartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={chartData.map((d) => ({
                      name:
                        chartType === "today"
                          ? `${d.hour}:00`
                          : chartType === "week"
                            ? d.day
                            : d.month,
                      count: d.count || d.deliveries,
                    }))}
                  >
                    <defs>
                      <linearGradient id="delivery" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff7a45" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#ffb899" stopOpacity={0.4} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffe1d2" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="url(#delivery)" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                {/* ✅ Updated Total Section */}
                {chartType === "month" ? (
                  <div className="mt-6 flex justify-between px-4">
                    <p className="text-lg font-semibold text-gray-700">
                      Total Deliveries:{" "}
                      <span className="text-orange-600 font-bold">
                        {chartData.length > 0
                          ? chartData[chartData.length - 1].deliveries
                          : 0}
                      </span>
                    </p>

                    <p className="text-lg font-semibold text-green-600">
                      ₹
                      {chartData.length > 0
                        ? chartData[chartData.length - 1].deliveries * ratePerDelivery
                        : 0}{" "}
                      earned
                    </p>
                  </div>

                ) : (
                  <div className="mt-6 flex justify-between px-4">
                    <p className="text-lg font-semibold text-gray-700">
                      Total Deliveries:{" "}
                      <span className="text-orange-600 font-bold">
                        {chartData.reduce(
                          (sum, d) => sum + (d.count || d.deliveries || 0),
                          0
                        )}
                      </span>
                    </p>
                    <p className="text-lg font-semibold text-green-600">
                      ₹{totalEarning} earned
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-400 text-center py-6">No deliveries yet.</p>
            )}
          </motion.div>

          {/* Orders Section */}
          {loadingOrder ? (
            <div className="text-center text-gray-500">Loading your orders...</div>
          ) : currentOrder ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/90 rounded-3xl border border-orange-100 shadow-lg p-6"
            >
              <h2 className="text-2xl font-semibold text-orange-600 mb-4">
                📦 Current Delivery
              </h2>
              <div className="p-4 bg-orange-50/50 rounded-xl mb-4">
                <p className="font-semibold text-lg">
                  🏪 {currentOrder?.shopOrder?.shop?.name || "Shop"}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  📍 {currentOrder?.deliveryAddress?.text || "No address"}
                </p>
              </div>
              <DeliveryBoyTracking
                data={{
                  deliveryBoyLocation,
                  customerLocation: {
                    lat: currentOrder?.deliveryAddress?.latitude,
                    lon: currentOrder?.deliveryAddress?.longitude,
                  },
                }}
              />
              {!showOtpBox ? (
                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="mt-6 w-full py-3 rounded-xl bg-linear-to-r from-green-500 to-green-600 text-white font-semibold shadow-md hover:scale-105 transition-all"
                >
                  {loading ? <ClipLoader size={20} color="white" /> : "Mark as Delivered"}
                </button>
              ) : (
                <div className="mt-4 bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm font-semibold mb-2 text-gray-700">
                    Enter OTP sent to customer:
                  </p>
                  <input
                    type="number"
                    className="w-full border px-3 py-2 rounded-lg mb-3 focus:ring-2 focus:ring-orange-400 outline-none"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    onClick={verifyOtp}
                    className="w-full py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all"
                  >
                    Submit OTP
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 rounded-3xl shadow-lg border border-orange-100 p-6"
            >
              <h2 className="text-2xl font-semibold text-orange-600 mb-4">
                🚚 Available Orders
              </h2>
              {assignmentsLoading ? (
                <p className="text-gray-400 text-center">Loading orders...</p>
              ) : availableAssignments.length ? (
                availableAssignments.map((a, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 flex justify-between items-center mb-3"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{a.shopName}</p>
                      <p className="text-sm text-gray-600">
                        📍 {a.deliveryAddress?.text}
                      </p>
                    </div>
                    <button
                      onClick={() => acceptOrder(a.assignmentID)}
                      className="px-5 py-2 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-md hover:scale-105 transition-all"
                    >
                      Accept
                    </button>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-6">
                  No available orders right now.
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <footer className="mt-16 text-center text-sm font-medium text-gray-600 pb-6">
        <hr className="border-gray-300 w-2/3 mx-auto mb-3" />
        <motion.p whileHover={{ scale: 1.05 }} className="text-center text-gray-700">
          ✨ Made by{" "}
          <span className="text-orange-600 font-semibold">Rishu Kumar</span>
        </motion.p>
      </footer>
    </div>
  );
}

export default DeliveryBoy;
