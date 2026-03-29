import React, { useEffect, useRef, useState } from "react";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi"; // ✅ added for bubble icon
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { useSelector } from "react-redux";
import FoodCard from "./foodcard";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const UserDashbord = () => {
  const { currentCity, shopInMyCity, itemsInMyCity, searchItems } = useSelector(
    (state) => state.user
  );

  const cateScrollRef = useRef();
  const shopScrollRef = useRef();
  const navigate = useNavigate();

  const [showLeftCateButton, setShowLeftCateButton] = useState(false);
  const [showRightCateButton, setShowRightCateButton] = useState(false);
  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);
  const [updatedItemList, setUpdatedItemList] = useState([]);

  // 🛒 Bubble state
  const [showCartBubble, setShowCartBubble] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // ✅ Filter food items by category
  const handleFilterByCategory = (category) => {
    if (category === "All") {
      setUpdatedItemList(itemsInMyCity);
    } else {
      const filteredList = itemsInMyCity?.filter(
        (i) => i.category === category
      );
      setUpdatedItemList(filteredList);
    }
  };

  // ✅ Handle "add to cart" with toast + bubble
  const handleAddToCart = (item, qty) => {
    // toast message
    toast.success(`${qty} ${qty > 1 ? "items" : "item"} added to your cart 🛒`, {
      icon: "🛍️",
      style: {
        borderRadius: "12px",
        background: "#fff9f6",
        color: "#ff4d2d",
        fontWeight: "600",
        boxShadow: "0 4px 8px rgba(255, 77, 45, 0.15)",
      },
    });

    // show bubble
    setCartCount((prev) => prev + qty);
    setShowCartBubble(true);

    // hide bubble after 3s
    setTimeout(() => {
      setShowCartBubble(false);
    }, 3000);
  };

  // ✅ Reset cart count when viewing cart
  useEffect(() => {
    if (window.location.pathname === "/cart") {
      setCartCount(0);
    }
  }, [window.location.pathname]);

  // ✅ Initialize item list
  useEffect(() => {
    setUpdatedItemList(itemsInMyCity);
  }, [itemsInMyCity]);

  // ✅ Update scroll buttons visibility
  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current;
    if (element) {
      const { scrollLeft, scrollWidth, clientWidth } = element;
      setLeftButton(scrollLeft > 0);
      setRightButton(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  // ✅ Handle scroll animation
  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleCateScroll = () =>
      updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton);
    const handleShopScroll = () =>
      updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);

    if (cateScrollRef.current) {
      updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton);
      cateScrollRef.current.addEventListener("scroll", handleCateScroll);
    }

    if (shopScrollRef.current) {
      updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);
      shopScrollRef.current.addEventListener("scroll", handleShopScroll);
    }

    updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton);
    updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);

    return () => {
      cateScrollRef.current?.removeEventListener("scroll", handleCateScroll);
      shopScrollRef.current?.removeEventListener("scroll", handleShopScroll);
    };
  }, [categories, shopInMyCity]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-linear-to-b from-[#fff9f6] to-[#ffe9e3] py-8 overflow-y-auto relative">

      {/* 🔍 Search Results Section */}
      {searchItems && searchItems.length > 0 && (
        <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4 animate-fadeIn">
          <h1 className="text-gray-900 text-2xl sm:text-3xl font-semibold border-b border-gray-200 pb-2">
            Search Results
          </h1>
          <div className="w-full flex flex-wrap gap-6 justify-center">
            {searchItems.map((item) => (
              <FoodCard key={item._id} data={item} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      )}

      {/* 🧭 Category Section */}
      <section className="w-full max-w-6xl flex flex-col gap-6 items-start px-4 sm:px-6 md:px-8 mt-10">
        <h1 className="text-gray-900 text-3xl sm:text-4xl font-semibold tracking-tight">
          ✨ Inspiration for your first order
        </h1>

        <div className="relative w-full">
          {showLeftCateButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 text-[#ff4d2d] p-3 rounded-full shadow-lg hover:bg-[#ff4d2d] hover:text-white transition-all duration-300 z-10"
              onClick={() => scrollHandler(cateScrollRef, "left")}
            >
              <FaCircleChevronLeft size={24} />
            </button>
          )}

          <div
            ref={cateScrollRef}
            className="w-full flex overflow-x-auto gap-5 pb-3 px-1 scroll-smooth scrollbar-hide"
          >
            {categories.map((cate, index) => (
              <div key={index} className="transition-all duration-300 hover:scale-105">
                <CategoryCard
                  name={cate.category}
                  image={cate.image}
                  onClick={() => handleFilterByCategory(cate.category)}
                />
              </div>
            ))}
          </div>

          {showRightCateButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 text-[#ff4d2d] p-3 rounded-full shadow-lg hover:bg-[#ff4d2d] hover:text-white transition-all duration-300 z-10"
              onClick={() => scrollHandler(cateScrollRef, "right")}
            >
              <FaCircleChevronRight size={24} />
            </button>
          )}
        </div>
      </section>

      {/* 🏪 Shop Section */}
      <section className="w-full max-w-6xl flex flex-col gap-6 items-start px-4 sm:px-6 md:px-8 mt-10">
        <h1 className="text-gray-900 text-3xl sm:text-4xl font-semibold tracking-tight">
          🏪 Best Shops in{" "}
          <span className="text-[#ff4d2d]">{currentCity || "your city"}</span>
        </h1>

        <div className="relative w-full">
          {showLeftShopButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 text-[#ff4d2d] p-3 rounded-full shadow-lg hover:bg-[#ff4d2d] hover:text-white transition-all duration-300 z-10"
              onClick={() => scrollHandler(shopScrollRef, "left")}
            >
              <FaCircleChevronLeft size={24} />
            </button>
          )}

          <div
            ref={shopScrollRef}
            className="w-full flex overflow-x-auto gap-5 pb-3 px-1 scroll-smooth scrollbar-hide"
          >
            {shopInMyCity?.length > 0 ? (
              shopInMyCity.map((shop, index) => (
                <div key={index} className="transition-all duration-300 hover:scale-105">
                  <CategoryCard
                    name={shop.name}
                    image={shop.image}
                    onClick={() => navigate(`/shop/${shop._id}`)}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic px-4">
                No shops found in this city yet.
              </p>
            )}
          </div>

          {showRightShopButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 text-[#ff4d2d] p-3 rounded-full shadow-lg hover:bg-[#ff4d2d] hover:text-white transition-all duration-300 z-10"
              onClick={() => scrollHandler(shopScrollRef, "right")}
            >
              <FaCircleChevronRight size={24} />
            </button>
          )}
        </div>
      </section>

      {/* 🍱 Food Section */}
      <section className="w-full max-w-6xl flex flex-col gap-6 items-start px-4 sm:px-6 md:px-8 mt-10 animate-fadeIn">
        <h1 className="text-gray-900 text-3xl sm:text-4xl font-semibold tracking-tight">
          🍱 Suggested Food Items
        </h1>

        <div className="w-full flex flex-wrap gap-6 justify-center">
          {updatedItemList?.length > 0 ? (
            updatedItemList.map((item, index) => (
              <div key={index} className="hover:scale-105 transition-all duration-300">
                <FoodCard data={item} onAddToCart={handleAddToCart} />
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No food items available.</p>
          )}
        </div>
      </section>

      {/* 🛒 Floating Cart Bubble */}
      {showCartBubble && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#ff4d2d] text-white font-semibold text-lg px-5 py-3 rounded-full shadow-lg transition-all duration-500 animate-bounce cursor-pointer"
          onClick={() => navigate("/cart")}
        >
          <FiShoppingCart size={22} />
          <span>
            {cartCount} item{cartCount > 1 ? "s" : ""} added
          </span>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 mb-4 text-center text-gray-600 text-sm font-medium">
        <hr className="border-t border-gray-300 w-2/3 mx-auto mb-3" />
        <p className="flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-300">
          ✨ MADE BY{" "}
          <span className="text-[#ff4d2d] font-semibold">RISHU KUMAR</span> 🚀
        </p>
      </footer>
    </div>
  );
};

export default UserDashbord;
