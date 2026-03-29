import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'

import { FaStore, FaUtensils, FaShoppingCart } from "react-icons/fa";
import { FaLocationDot, FaArrowLeftLong } from "react-icons/fa6";

import FoodCard from '../component/foodcard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Shop() {
  const { shopId } = useParams();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [showCartBubble, setShowCartBubble] = useState(false);
  const navigate = useNavigate();

  const handleShop = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`, { withCredentials: true });
      setShop(result.data.shop);
      setItems(result.data.item || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = (item) => {
    setCartCount(prev => prev + 1);
    setShowCartBubble(true);

    setTimeout(() => setShowCartBubble(false), 5000);
  };

  useEffect(() => {
    handleShop();
  }, [shopId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white relative">
      <ToastContainer />

      {/* 🔙 Back */}
      <button
        className="absolute top-5 left-5 z-20 flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white px-3 py-2 rounded-full shadow-md backdrop-blur-md transition-all"
        onClick={() => navigate("/")}
      >
        <FaArrowLeftLong /> Back
      </button>

      {/* 🏪 Shop header */}
      {shop && (
        <div className="relative w-full h-64 md:h-80 lg:h-[420px] overflow-hidden rounded-b-[40px] shadow-lg">
          <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/20 flex flex-col justify-center items-center text-center px-6">
            <FaStore className="text-white text-5xl mb-3" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">{shop.name}</h1>
            <div className="flex items-center justify-center gap-2 mt-3">
              <FaLocationDot size={20} color="#FF4D2D" />
              <p className="text-base md:text-lg text-gray-100">{shop.address}</p>
            </div>
          </div>
        </div>
      )}

      {/* 🍽 Menu */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="flex items-center justify-center gap-3 text-3xl font-extrabold mb-10 text-gray-800">
          <FaUtensils color="#FF4D2D" />
          Our Menu
        </h2>

        {items.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8">
            {items.map((item) => (
              <FoodCard
                key={item._id}
                data={item}
                onAddToCart={() => handleAddToCart(item)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/857/857681.png"
              alt="No items"
              className="w-32 mb-6 opacity-70"
            />
            <p className="text-lg text-gray-500">No items available 🍴</p>
          </div>
        )}
      </div>

      {/* 🛒 Floating cart count bubble (bottom-right) */}
      {showCartBubble && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#ff4d2d] text-white font-semibold text-lg px-5 py-3 rounded-full shadow-lg transition-all duration-500 animate-bounce"
        >
          <FaShoppingCart size={20} />
          <span className='cursor-pointer' onClick={() => navigate("/cart")}> {cartCount} item{cartCount > 1 ? "s" : ""} added</span>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 mb-4 text-center text-gray-600 text-sm font-medium">
        <hr className="border-t border-gray-300 w-2/3 mx-auto mb-3" />
        <p className="flex items-center justify-center gap-2">
          ✨ MADE BY <span className="text-[#ff4d2d] font-semibold">RISHU KUMAR</span> 🚀
        </p>
      </footer>
    </div>
  );
}

export default Shop;
