import React, { useState } from 'react';
import {
  FaLeaf,
  FaDrumstickBite,
  FaStar,
  FaMinus,
  FaPlus,
  FaShoppingCart
} from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';

function FoodCard({ data, onAddToCart }) {
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.user);

  // ⭐ Render stars dynamically
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-400 text-sm drop-shadow-sm" />
        ) : (
          <FaRegStar key={i} className="text-yellow-400 text-sm drop-shadow-sm" />
        )
      );
    }
    return stars;
  };

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => (prev > 0 ? prev - 1 : 0));

  const alreadyInCart = cartItems.some(i => i.id === data._id);

  const handleAddToCart = () => {
    if (quantity > 0) {
      dispatch(addToCart({
        id: data._id,
        name: data.name,
        price: data.price,
        image: data.image,
        shop: data.shop,
        quantity,
        foodType: data.foodType
      }));

      // 🔔 Notify parent (UserDashboard)
      if (onAddToCart) onAddToCart(data, quantity);
    }
  };

  return (
    <div
      className="w-[260px] flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl 
      border border-orange-100 transition-all duration-300 overflow-hidden group"
    >
      {/* 🥗 Image Section */}
      <div className="relative h-[170px] overflow-hidden">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm">
          {data.foodType === "veg" ? (
            <FaLeaf className="text-green-600 text-lg" />
          ) : (
            <FaDrumstickBite className="text-red-600 text-lg" />
          )}
        </div>
        <div className="absolute bottom-0 w-full bg-linear-to-t from-black/60 to-transparent p-2 text-white text-sm font-medium">
          {data.shop?.name || "Restaurant"}
        </div>
      </div>

      {/* 🍛 Content Section */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h2 className="font-semibold text-gray-900 text-base truncate">
            {data.name}
          </h2>
          <div className="flex items-center gap-1 mt-1">
            {renderStars(data.rating?.average || 0)}
            <span className="text-sm text-gray-600 ml-1">
              ({data.rating?.count || 0})
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {data.description || "Deliciously made with fresh ingredients."}
          </p>
        </div>
      </div>

      {/* 💰 Price & Cart Actions */}
      <div className="flex items-center justify-between border-t border-orange-100 p-3 bg-orange-50/30">
        <span className="font-bold text-gray-900 text-lg">₹{data.price}</span>

        {/* Quantity + Cart */}
        <div className="flex items-center gap-1 border border-gray-200 rounded-full bg-white shadow-sm">
          <button
            className="px-2 py-1 hover:bg-gray-100 text-gray-700 transition"
            onClick={handleDecrease}
          >
            <FaMinus size={12} />
          </button>
          <span className="px-2 text-sm font-medium w-5 text-center">{quantity}</span>
          <button
            className="px-2 py-1 hover:bg-gray-100 text-gray-700 transition"
            onClick={handleIncrease}
          >
            <FaPlus size={12} />
          </button>

          <button
            className={`px-3 py-2 ml-1 text-white rounded-r-full transition-all duration-300 flex items-center justify-center
            ${alreadyInCart
              ? "bg-gray-700 hover:bg-gray-800"
              : "bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            }`}
            onClick={handleAddToCart}
          >
            <FaShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
