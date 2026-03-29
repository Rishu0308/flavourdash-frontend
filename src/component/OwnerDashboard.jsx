import React from "react";
import { useSelector } from "react-redux";
import { FaUtensils, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import OwnerItemCard from "./OwnerItemCard";

function OwnerDashboard() {
  const { myShopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-[#fff9f6] to-[#ffe9e3] flex flex-col items-center py-8 px-3 sm:px-4 overflow-y-auto">
      {/* ========== No Shop Yet Section ========== */}
      {!myShopData && (
        <div className="flex justify-center items-center w-full animate-fadeIn">
          <div className="w-full max-w-sm sm:max-w-md bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 sm:p-8 border border-orange-100 hover:shadow-2xl transition-all duration-300 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-[#ff4d2d]/10 p-3 sm:p-4 rounded-full">
                <FaUtensils className="text-[#ff4d2d]" size={40} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                🍽️ Add Your Restaurant
              </h2>
              <p className="text-gray-600 text-xs sm:text-base leading-relaxed px-1">
                🚀 Start your food journey with us! List your restaurant and
                reach thousands of hungry customers 🍔🍕.
              </p>
              <button
                className="bg-[#ff4d2d] text-white px-5 py-2 sm:px-6 sm:py-3 rounded-full font-medium shadow-md hover:bg-[#e64528] transition-all duration-200 text-sm sm:text-base"
                onClick={() => navigate("/create-edit-shop")}
              >
                🍴 Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== Shop Exists Section ========== */}
      {myShopData && (
        <div className="w-full flex flex-col items-center gap-8 sm:gap-10 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col items-center mt-4 text-center px-2">
            <div className="bg-[#ff4d2d]/10 p-3 sm:p-4 rounded-full mb-3">
              <FaUtensils className="text-[#ff4d2d]" size={40} />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-snug">
              👨‍🍳 Welcome to{" "}
              <span className="text-[#ff4d2d]">{myShopData.name}</span> 🎉
            </h1>
            <p className="text-gray-600 text-xs sm:text-base mt-2">
              🛠️ Manage your restaurant and food items easily from one place.
            </p>
          </div>

          {/* Shop Info Card */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300 w-full max-w-sm sm:max-w-3xl relative">
            <div
              className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#ff4d2d] text-white p-2 sm:p-3 rounded-full shadow-md hover:bg-[#e64528] transition-all cursor-pointer"
              onClick={() => navigate("/create-edit-shop")}
              title="Edit Shop"
            >
              <FaPen size={16} />
            </div>
            <img
              src={myShopData.image}
              alt={myShopData.name}
              className="w-full h-40 sm:h-56 md:h-72 object-cover"
            />
            <div className="p-4 sm:p-6 flex flex-col gap-2 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                🍜 {myShopData.name}
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">
                📍 {myShopData.city}, {myShopData.state}
              </p>
              <p className="text-gray-600 text-xs sm:text-sm">
                🏠 {myShopData.address}
              </p>
            </div>
          </div>

          {/* ========== Food Items ========== */}
          {myShopData.items.length === 0 ? (
            <div className="flex justify-center items-center w-full">
              <div className="w-full max-w-sm sm:max-w-md bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 sm:p-8 border border-orange-100 hover:shadow-2xl transition-all duration-300 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-[#ff4d2d]/10 p-3 sm:p-4 rounded-full">
                    <FaUtensils className="text-[#ff4d2d]" size={40} />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    🍲 Add Your Food Item
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-base leading-relaxed px-1">
                    😋 Share your delicious creations with our customers by
                    adding them to your menu.
                  </p>
                  <button
                    className="bg-[#ff4d2d] text-white px-5 py-2 sm:px-6 sm:py-3 rounded-full font-medium shadow-md hover:bg-[#e64528] transition-all duration-200 text-sm sm:text-base"
                    onClick={() => navigate("/add-item")}
                  >
                    ➕ Add Food
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5 w-full max-w-sm sm:max-w-3xl">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                🍽️ Your Food Menu
              </h2>
              <div className="w-full flex flex-col gap-4 px-1 sm:px-0">
                {myShopData.items.map((item, index) => (
                  <div
                    key={index}
                    className="transition-transform duration-300 hover:scale-[1.02]"
                  >
                    <OwnerItemCard data={item} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========== Footer Section ========== */}
      <footer className="mt-12 mb-4 text-center text-gray-600 text-xs sm:text-sm font-medium px-2">
        <hr className="border-t border-gray-300 w-2/3 mx-auto mb-3" />
        <p className="flex items-center justify-center gap-1 sm:gap-2 hover:scale-105 transition-transform duration-300 flex-wrap">
          ✨ MADE BY{" "}
          <span className="text-[#ff4d2d] font-semibold">RISHU KUMAR</span> 🚀
        </p>
      </footer>
    </div>
  );
}

export default OwnerDashboard;
