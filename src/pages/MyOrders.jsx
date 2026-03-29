import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import UserOrderCard from '../component/userOrderCard';
import OwnerOrderCard from '../component/ownerOrderCard';
import { setMyOrders, updateRealtimeOrderStatus } from '../redux/userSlice';
import { Socket } from 'socket.io-client';

function MyOrders() {
  const { userData, MyOrders, socket } = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
  socket?.on('newOrder', (data) => {
    if (data.shopOrders?.owner._id == userData._id) {
      dispatch(setMyOrders([data, ...MyOrders]))
    }
  });

  socket?.on('update-status', ({orderId, shopId, status, userId}) => {
    if (userId == userData._id) {
      dispatch(updateRealtimeOrderStatus({orderId, shopId, status}))
    }
  })
  return () => {
    socket?.off('newOrder')
    socket?.off('update-status')
  };
}, [socket]);
  

  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex justify-center px-4'>
      <div className='w-full max-w-[800px] p-4'>

        {/* Header */}
        <div className='flex items-center gap-[20px] mb-6'>
          <div
            className="z-[10] cursor-pointer"
            onClick={() => navigate("/")}
          >
            <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
          </div>
          <h1 className='text-2xl font-bold text-start'>My Orders</h1>
        </div>

        {/* Orders Section */}
        <div className='space-y-6'>
          {MyOrders && MyOrders.length > 0 ? (
            MyOrders.map((order, index) => (
              userData.role === "user" ? (
                <UserOrderCard data={order} key={index} />
              ) : userData.role === "owner" ? (
                <OwnerOrderCard data={order} key={index} />
              ) : null
            ))
          ) : (
            <>
              {userData.role === "user" && (
                <div className="text-center mt-16">
                  <p className="text-gray-500 text-lg font-medium">
                    😔 You haven't placed any orders yet.
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Start exploring your favorite meals and place your first order now!
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="mt-6 bg-[#ff4d2d] hover:bg-[#e64528] text-white px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-300"
                  >
                    🍽️ Order Now
                  </button>
                </div>
              )}

              {userData.role === "owner" && (
                <div className="text-center mt-16">
                  <p className="text-gray-500 text-lg font-medium">
                    🏪 No orders received yet.
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Once customers start ordering from your shop, their orders will appear here.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 mb-4 text-center text-gray-600 text-sm font-medium">
          <hr className="border-t border-gray-300 w-2/3 mx-auto mb-3" />
          <p className="flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-300">
            ✨ MADE BY{" "}
            <span className="text-[#ff4d2d] font-semibold">RISHU KUMAR</span> 🚀
          </p>
        </footer>
      </div>
    </div>
  )
}

export default MyOrders
