import React from 'react';
import { FaMinus, FaPlus } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { useDispatch } from 'react-redux';
import { removeCartItem, updateQuantity } from '../redux/userSlice';

function CartItemCard({ data }) {
  const dispatch = useDispatch();

  const handleIncrease = () => {
    dispatch(updateQuantity({ id: data.id, quantity: data.quantity + 1 }));
  };

  const handleDecrease = () => {
    if (data.quantity > 1) {
      dispatch(updateQuantity({ id: data.id, quantity: data.quantity - 1 }));
    }
  };

  const handleRemove = () => {
    dispatch(removeCartItem(data.id));
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between
     bg-white p-3 sm:p-4 rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300 gap-4">
      
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
        <img
          src={data.image}
          alt={data.name}
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border shrink-0"
        />
        <div className="flex flex-col">
          <h1 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">{data.name}</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            ₹{data.price} x {data.quantity}
          </p>
          <p className="font-bold text-gray-800 text-sm sm:text-base mt-1">
            ₹{data.price * data.quantity}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto border-t sm:border-none pt-2 sm:pt-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleDecrease}
            className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={data.quantity <= 1}
          >
            <FaMinus size={10} className="sm:w-3 sm:h-3" />
          </button>

          <span className="font-medium text-gray-800 text-sm sm:text-base w-6 text-center">
            {data.quantity}
          </span>

          <button
            onClick={handleIncrease}
            className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <FaPlus size={10} className="sm:w-3 sm:h-3" />
          </button>
        </div>

        <button
          onClick={handleRemove}
          className="p-1.5 sm:p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
        >
          <CiTrash size={18} className="sm:w-[18px] sm:h-[18px]" />
        </button>
      </div>
    </div>
  );
}

export default CartItemCard;
