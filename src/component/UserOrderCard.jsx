import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify"; // ✅ Toast import
import "react-toastify/dist/ReactToastify.css";

function UserOrderCard({ data }) {
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState({}); // { itemId: rating }

  // 🧠 Load saved ratings when component mounts
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/item/user-ratings`, {
          withCredentials: true,
        });
        const userRatings = response.data?.ratings || [];
        const ratingMap = {};
        userRatings.forEach((r) => {
          ratingMap[r.itemId] = r.rating;
        });
        setSelectedRating(ratingMap);

        // ✅ Save in localStorage for faster reload
        localStorage.setItem("userRatings", JSON.stringify(ratingMap));
      } catch (error) {
        // fallback to localStorage if API fails
        const localRatings = JSON.parse(localStorage.getItem("userRatings") || "{}");
        setSelectedRating(localRatings);
      }
    };
    fetchRatings();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      case "in-progress":
      case "dispatched":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // ⭐ Handle Rating with Toast
  const handleRating = async (itemId, rating) => {
    try {
      await axios.post(
        `${serverUrl}/api/item/rating`,
        { itemId, rating },
        { withCredentials: true }
      );

      // 🟢 Update local state & localStorage
      setSelectedRating((prev) => {
        const updated = { ...prev, [itemId]: rating };
        localStorage.setItem("userRatings", JSON.stringify(updated));
        return updated;
      });

      // 🎉 Show success toast
      toast.success(`You rated ${rating}★ — Thanks for your feedback! 💛`, {
        autoClose: 1500,
        position: "top-center",
        theme: "colored",
      });
    } catch (error) {
      console.log("Rating Error:", error);
      toast.error("Oops! Something went wrong while submitting your rating 😢", {
        autoClose: 2000,
        position: "top-center",
        theme: "colored",
      });
    }
  };

  // 🛒 No orders case
  if (!data || !Array.isArray(data.shopOrders) || data.shopOrders.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] text-center px-4 space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">🛍️ No Orders Yet</h2>
        <p className="text-gray-500 max-w-sm text-sm sm:text-base">
          It looks like you haven't placed any orders yet. Start exploring delicious meals and order now!
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-3 bg-[#ff4d2d] hover:bg-[#e64528] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md transition-all duration-200 text-sm sm:text-base"
        >
          🍔 Order Now
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-orange-100 p-4 sm:p-6 space-y-4 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-3 space-y-2 sm:space-y-0">
        <div>
          <p className="font-semibold text-gray-800 text-lg sm:text-xl">
            🧾 Order #{data?._id ? data._id.slice(-6) : ""}
          </p>
          <p className="text-sm text-gray-500 mt-1">📅 {formatDate(data?.createdAt)}</p>
        </div>

        <div className="text-left sm:text-right">
          {data.paymentMethod === "cod" ? (
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              💵 Payment: {data.paymentMethod.toUpperCase()}
            </p>
          ) : data.payment ? (
            <p className="text-xs sm:text-sm text-green-600 font-medium">
              💳 Online Payment Successful
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-red-500 font-medium">
              💳 Payment Pending / Failed
            </p>
          )}

          <span
            className={`inline-block mt-1 text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 rounded-full border ${getStatusColor(
              data?.shopOrders?.[0]?.status
            )}`}
          >
            {data?.shopOrders?.[0]?.status ?? "Pending"}
          </span>
        </div>
      </div>

      {/* Shop Orders */}
      {data.shopOrders.map((shopOrder, index) => (
        <div
          key={index}
          className="border border-orange-100 rounded-xl p-3 sm:p-4 bg-[#fffaf7] shadow-sm hover:shadow-md transition-all duration-300"
        >
          <p className="font-semibold text-gray-800 mb-2 text-base sm:text-lg">
            🏪 {shopOrder?.shop?.name ?? "Shop"}
          </p>

          {Array.isArray(shopOrder?.shopOrderItems) && shopOrder.shopOrderItems.length > 0 ? (
            <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {shopOrder.shopOrderItems.map((item, idx) => (
                <div
                  key={idx}
                  className="shrink-0 w-28 sm:w-36 border border-gray-100 rounded-lg p-2 bg-white hover:shadow-lg transition-all duration-200"
                >
                  <img
                    src={item?.item?.image}
                    alt={item?.name ?? "Item"}
                    className="w-full h-20 sm:h-24 object-cover rounded-md"
                  />
                  <p className="text-xs sm:text-sm font-semibold mt-2 text-gray-800 truncate">
                    {item?.name}
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-500">
                    Qty: {item?.quantity} x ₹{item?.price}
                  </p>

                  {/* 🌟 Animated Rating Section with Emoji Reaction */}
                  {shopOrder?.status === "delivered" && item?.item?._id && (
                    <div className="flex flex-col items-center justify-center mt-3 space-y-1">
                      <div className="flex items-center justify-center">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isActive = (selectedRating[item?.item?._id] || 0) >= star;
                          return (
                            <button
                              key={star}
                              onClick={() => handleRating(item?.item?._id, star)}
                              className={`relative text-xl sm:text-2xl transition-all duration-300 transform 
                                hover:scale-125 active:scale-110 focus:scale-125
                                ${
                                  isActive
                                    ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(255,215,0,0.8)]"
                                    : "text-gray-300 hover:text-yellow-200"
                                }`}
                            >
                              ★
                              {isActive && (
                                <span className="absolute inset-0 rounded-full animate-ripple text-yellow-300/70">
                                  ★
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {selectedRating[item?.item?._id] && (
                        <div className="flex flex-col items-center justify-center mt-1 animate-fadeIn">
                          <span className="text-lg sm:text-xl">
                            {
                              {
                                1: "😡",
                                2: "😞",
                                3: "😐",
                                4: "😋",
                                5: "😍",
                              }[selectedRating[item?.item?._id]]
                            }
                          </span>
                          <p className="text-[11px] sm:text-xs text-amber-600 font-medium mt-0.5">
                            {
                              {
                                1: "Terrible 😣",
                                2: "Not great 😕",
                                3: "Okay 😐",
                                4: "Loved it 😋",
                                5: "Absolutely amazing! 😍",
                              }[selectedRating[item?.item?._id]]
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic text-sm">No items found in this order.</p>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-t border-gray-200 pt-2 sm:pt-3 mt-2 space-y-1 sm:space-y-0">
            <p className="font-semibold text-gray-800 text-sm sm:text-base">
              Subtotal: ₹{shopOrder?.subtotal ?? 0}
            </p>
            <span
              className={`text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 rounded-full border ${getStatusColor(
                shopOrder?.status
              )}`}
            >
              {shopOrder?.status ?? "Pending"}
            </span>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-t border-gray-200 pt-3 mt-2 space-y-3 sm:space-y-0">
        <p className="font-semibold text-base sm:text-lg text-gray-800 text-center sm:text-left">
          Total: ₹{data?.totalAmount ?? 0}
        </p>
        <button
          className="bg-[#ff4d2d] hover:bg-[#e64528] text-white px-4 sm:px-5 py-2 rounded-full font-medium shadow-md transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
          onClick={() => navigate(`/track-order/${data._id}`)}
        >
          🚚 Track Order
        </button>
      </div>
    </div>
  );
}

export default UserOrderCard;
