import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { MdPhone, MdEmail } from "react-icons/md";
import { serverUrl } from '../App';
import { updateOrderStatus } from '../redux/userSlice';
import { useDispatch } from 'react-redux';

function OwnerOrderCard({ data }) {
  const dispatch = useDispatch();

  // --- NEW: local state to reflect immediate API response ---
  const [localShopOrder, setLocalShopOrder] = useState(null);

  // Keep localShopOrder in sync if parent prop `data` changes (initial load)
  useEffect(() => {
    // set initial from props (first shopOrder only)
    const shopOrders = Array.isArray(data?.shopOrders) ? data.shopOrders : data?.shopOrders ? [data.shopOrders] : [];
    setLocalShopOrder(shopOrders[0] || null);
  }, [data]);

  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
        { status },
        { withCredentials: true }
      );

      // --- DEBUG: log full response so you can inspect in console / network tab ---
      console.log("update-status response:", result.data);

      // 1) Update Redux global state (keeps MyOrders in sync)
      dispatch(updateOrderStatus({
        orderId,
        shopId,
        status: result.data.shopOrder.status,
        assignedDeliveryBoy: result.data.assignedDeliveryBoy,
        availableBoys: result.data.availableBoys
      }));

      // 2) Update local state immediately from API response so this card re-renders
      // result.data.shopOrder should be the updated shopOrder object returned by backend
      if (result.data && result.data.shopOrder) {
        setLocalShopOrder(result.data.shopOrder);
      } else {
        // Fallback: update only status if full shopOrder not returned
        setLocalShopOrder(prev => prev ? { ...prev, status } : prev);
      }

    } catch (error) {
      console.error("Error updating order status:", error.response?.data || error.message);
    }
  };

  // Use localShopOrder if available, else fallback to prop-derived first shopOrder
  const shopOrder = localShopOrder || (Array.isArray(data?.shopOrders) ? data.shopOrders[0] : data?.shopOrders ? [data.shopOrders][0] : null);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    preparing: "bg-blue-100 text-blue-700 border-blue-300",
    "out for delivery": "bg-green-100 text-green-700 border-green-300",
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-6 space-y-5 hover:shadow-lg transition-all duration-300">
      {/* Customer Info */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            👤 {data?.user?.fullName}
          </h2>
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <MdEmail className="text-orange-500" /> {data?.user?.email}
          </p>
          <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <MdPhone className="text-orange-500" /> {data?.user?.mobile}
          </p>
          {data.paymentMethod === "online" ? (
            data.payment ? (
              <p className="text-green-600 font-medium">💳 Online Payment Successful</p>
            ) : (
              <p className="text-red-500 font-medium">💳 Online Payment Pending / Failed</p>
            )
          ) : (
            <p className="text-gray-700 font-medium">💵 Payment Method: {data.paymentMethod}</p>
          )}
        </div>

        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[shopOrder?.status] || "bg-gray-100 text-gray-600 border-gray-300"}`}
        >
          {shopOrder?.status?.toUpperCase()}
        </div>
      </div>

      {/* Delivery Address */}
      <div className="text-sm bg-orange-50/60 rounded-lg p-3 border border-orange-100">
        <p className="text-gray-700 font-medium mb-1">📍 Delivery Address</p>
        <p className="text-gray-600">{data?.deliveryAddress?.text}</p>
        <p className="text-xs text-gray-500 mt-1">
          Lat: {data?.deliveryAddress?.latitude} | Lon: {data?.deliveryAddress?.longitude}
        </p>
      </div>

      {/* Ordered Items */}
      <div className="overflow-x-auto flex gap-4 pb-3">
        {shopOrder?.shopOrderItems?.map((item, index) => (
          <div
            key={index}
            className="shrink-0 w-40 rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md bg-white transition-all"
          >
            <img src={item?.item?.image} alt={item?.name} className="w-full h-24 object-cover" />
            <div className="p-2">
              <p className="text-sm font-semibold text-gray-800 truncate">{item?.name}</p>
              <p className="text-xs text-gray-500">Qty: {item?.quantity} X ₹{item?.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status & Actions */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="text-sm text-gray-700 font-medium">
          Status: <span className="font-semibold text-orange-600 capitalize">{shopOrder?.status}</span>
        </div>

        <select
          value={shopOrder?.status || ""}
          onChange={(e) => handleUpdateStatus(data?._id, shopOrder?.shop?._id, e.target.value)}
          className="rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 ring-orange-400 border-orange-300 text-orange-600 font-medium bg-orange-50/30"
        >
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out for delivery">Out for Delivery</option>
        </select>
      </div>

      {/* Delivery Boys */}
      {shopOrder?.status === "out for delivery" && (
        <div className="mt-3 p-3 border rounded-lg text-sm bg-green-50 border-green-100 animate-fadeIn">
          {shopOrder?.assignedDeliveryBoy ? (
            <p className="font-semibold text-gray-800 mb-2">Assigned Delivery Boy:</p>
          ) : (
            <p className="font-semibold text-gray-800 mb-2">Available Delivery Boys:</p>
          )}

          {shopOrder?.assignedDeliveryBoy ? (
            <div className="text-gray-700">
              {shopOrder.assignedDeliveryBoy.fullName} — {shopOrder.assignedDeliveryBoy.mobile}
            </div>
          ) : shopOrder?.availableBoys?.length > 0 ? (
            shopOrder.availableBoys.map((b, i) => (
              <div key={i} className="text-gray-700">{b.fullName} — {b.mobile}</div>
            ))
          ) : (
            <div className="text-gray-500 italic">Waiting for a delivery boy to accept...</div>
          )}
        </div>
      )}

      {/* Subtotal */}
      <div className="text-right pt-2 border-t border-gray-100">
        <p className="text-base font-bold text-gray-800">
          Total: <span className="text-orange-600">₹{shopOrder?.subtotal}</span>
        </p>
      </div>
    </div>
  );
}

export default OwnerOrderCard;
