import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/userSlice"; // ✅ adjust path if needed
import { useNavigate } from "react-router-dom";

function OrderPlaced() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Clear cart automatically after order completion
  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className='min-h-screen bg-[#fff9f6] flex flex-col justify-center items-center px-4 text-center relative overflow-hidden'>

      {/* ✅ Animated Success Circle with Tick */}
      <div className="success-animation mb-6">
        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
          <path className="checkmark-check" fill="none" d="M16 26l7 7 13-13" />
        </svg>
      </div>

      <h1 className='text-3xl font-bold text-gray-800 mb-2'>Order Placed!</h1>
      <p className='text-gray-600 max-w-md mb-6'>
        Thank you for your purchase. Your order is being prepared.
        You can track your order status in the "My Orders" section.
      </p>

      <button 
        className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-6 py-3 rounded-lg
        text-lg font-medium transition' 
        onClick={() => navigate("/my-orders")}
      >
        Back to My Orders
      </button>

      <footer className="mt-16 mb-4 text-center text-gray-600 text-sm font-medium">
        <hr className="border-t border-gray-300 w-2/3 mx-auto mb-3" />
        <p className="flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-300">
          ✨ MADE BY{" "}
          <span className="text-[#ff4d2d] font-semibold">RISHU KUMAR</span> 🚀
        </p>
      </footer>

      {/* ✅ Internal Styles */}
      <style>{`
        .success-animation {
          width: 100px;
          height: 100px;
          display: inline-block;
          position: relative;
        }

        .checkmark {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: block;
          stroke-width: 2;
          stroke: #4bb543;
          stroke-miterlimit: 10;
          box-shadow: inset 0px 0px 0px #4bb543;
          animation: fillCircle .4s ease-in-out .4s forwards, scaleCircle .3s ease-in-out .9s both;
        }

        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: #4bb543;
          fill: none;
          animation: strokeCircle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }

        .checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          stroke: #fff;
          stroke-width: 3;
          animation: strokeCheck 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards,
                    tickBounce 0.4s ease-out 0.9s both;
        }

        @keyframes strokeCircle { 100% { stroke-dashoffset: 0; } }
        @keyframes strokeCheck { 100% { stroke-dashoffset: 0; } }
        @keyframes fillCircle { 100% { box-shadow: inset 0px 0px 0px 60px #4bb543; } }
        @keyframes scaleCircle { 0%, 100% { transform: none; } 50% { transform: scale(1.1); } }
        @keyframes tickBounce { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }

        h1, p, button {
          animation: fadeInUp 0.6s ease forwards;
          opacity: 0;
        }

        h1 { animation-delay: 0.8s; }
        p { animation-delay: 1s; }
        button { animation-delay: 1.2s; }

        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default OrderPlaced;