import React from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../component/CartItemCard';
import { FaShoppingCart } from "react-icons/fa";

function Cartpage() {
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useSelector(state => state.user);

  return (
    <div className="min-h-screen bg-[#fff9f6] flex justify-center px-6 py-10">
      <div className="w-full max-w-[850px]">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="p-1 rounded-full hover:bg-orange-100 transition"
          >
            <IoIosArrowRoundBack size={38} className="text-[#ff4d2d]" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
        </div>

        {/* Empty Cart */}
        {cartItems?.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <FaShoppingCart className="text-gray-300 text-6xl mb-3" />
            <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
            <button
              onClick={() => navigate("/")}
              className="mt-3 bg-[#ff4d2d] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#e64526] transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <CartItemCard key={index} data={item} />
              ))}
            </div>

            {/* Total Amount (Sticky Footer Card) */}
            <div className="sticky bottom-4 bg-white p-5 rounded-xl shadow-lg border flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Total Amount</h2>
                <p className="text-sm text-gray-500">Including all items</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-2xl font-bold text-[#ff4d2d]">
                  ₹{totalAmount}
                </span>
                <button
                  onClick={() => navigate("/checkout")}
                  className="bg-[#ff4d2d] text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-[#e64526] transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
        <footer className="mt-16 mb-4 text-center text-gray-600 text-sm font-medium">
        <hr className="border-t border-gray-300 w-2/3 mx-auto mb-3" />
        <p className="flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-300">
          ✨ MADE BY{" "}
          <span className="text-[#ff4d2d] font-semibold">RISHU KUMAR</span> 🚀
        </p>
      </footer>
      </div>
    </div>
  );
}

export default Cartpage;
