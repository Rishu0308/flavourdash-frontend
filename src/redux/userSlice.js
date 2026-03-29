import { createSlice } from "@reduxjs/toolkit";
// import { Socket } from "socket.io";

// ✅ Load initial state from localStorage
const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
const storedTotalAmount = JSON.parse(localStorage.getItem("totalAmount")) || 0;

const saveCartToLocalStorage = (cartItems, totalAmount) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  localStorage.setItem("totalAmount", JSON.stringify(totalAmount));
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    currentCity: null,
    currentState: null,
    currentAddress: null,
    shopInMyCity: null,
    itemsInMyCity: null,
    cartItems: storedCartItems,
    totalAmount: storedTotalAmount,
    MyOrders: [],
    searchItems: null, // ✅ holds searched results
    socket:null
  },

  reducers: {
    // ✅ User info
    setUserData: (state, action) => {
      state.userData = action.payload;
    },

    // ✅ Location
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload || "";
    },
    setCurrentState: (state, action) => {
      state.currentState = action.payload || "";
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload || "";
    },

    // ✅ Shop & Items
    setShopInMyCity: (state, action) => {
      state.shopInMyCity = action.payload || "";
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload || "";
    },

    setSocket: (state, action) => {
      state.socket = action.payload || "";
    },

    addToCart: (state, action) => {
      const cartItem = action.payload;
      const existingItem = state.cartItems.find((i) => i.id === cartItem.id);

      if (existingItem) {
        existingItem.quantity += cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }

      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      saveCartToLocalStorage(state.cartItems, state.totalAmount);
    },

    // ✅ Update Quantity
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.id === id);
      if (item) {
        item.quantity = quantity;
      }

      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      saveCartToLocalStorage(state.cartItems, state.totalAmount);
    },

    // ✅ Remove Cart Item
    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);

      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      saveCartToLocalStorage(state.cartItems, state.totalAmount);
    },

    // ✅ Clear Cart
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      localStorage.removeItem("cartItems");
      localStorage.removeItem("totalAmount");
    },

    // ✅ Orders
    setMyOrders: (state, action) => {
      state.MyOrders = action.payload || [];
    },

    addMyOrders: (state, action) => {
      state.MyOrders = [action.payload, ...state.MyOrders];
    },

    // ✅ Update Order Status + Delivery Boy info
    updateOrderStatus: (state, action) => {
      const { orderId, shopId, status, assignedDeliveryBoy, availableBoys } =
        action.payload;

      const orderIndex = state.MyOrders.findIndex((o) => o._id === orderId);
      if (orderIndex === -1) return;

      const order = state.MyOrders[orderIndex];
      const shopOrdersArray = Array.isArray(order.shopOrders)
        ? order.shopOrders
        : order.shopOrders
        ? [order.shopOrders]
        : [];

      const shopOrderIndex = shopOrdersArray.findIndex(
        (so) => so.shop?._id === shopId
      );
      if (shopOrderIndex === -1) return;

      const currentShopOrder = shopOrdersArray[shopOrderIndex];
      shopOrdersArray[shopOrderIndex] = {
        ...currentShopOrder,
        status,
        assignedDeliveryBoy:
          assignedDeliveryBoy !== undefined
            ? assignedDeliveryBoy
            : currentShopOrder.assignedDeliveryBoy,
        availableBoys:
          availableBoys !== undefined
            ? availableBoys
            : currentShopOrder.availableBoys || [],
      };

      state.MyOrders[orderIndex] = {
        ...order,
        shopOrders: shopOrdersArray,
      };
    },

    updateRealtimeOrderStatus:(state, action) =>{
      const{orderId, shopId, status} = action.payload
      const order = state.MyOrders.find(o=>o._id == orderId)
      if (order) {
        const shopOrder = order.shopOrders.find(so => so.shop._id == shopId)
        if (shopOrder) {
          shopOrder.status = status
        } 
      }
    },

    setSearchItems: (state, action) => {
      state.searchItems = action.payload;
    },

    // ✅ Logout
    logout: (state) => {
      state.userData = null;
      state.currentCity = null;
      state.currentState = null;
      state.currentAddress = null;
      state.shopInMyCity = null;
      state.itemsInMyCity = null;
      state.cartItems = [];
      state.totalAmount = 0;
      state.MyOrders = [];
      state.searchItems = null;
      localStorage.removeItem("cartItems");
      localStorage.removeItem("totalAmount");
    },
  },
});

export const {
  setUserData,
  setCurrentCity,
  setCurrentState,
  setCurrentAddress,
  setShopInMyCity,
  setItemsInMyCity,
  addToCart,
  updateQuantity,
  removeCartItem,
  clearCart,
  setMyOrders,
  addMyOrders,
  updateOrderStatus,
  setSearchItems,
  logout,
  setSocket,
  updateRealtimeOrderStatus
} = userSlice.actions;

export default userSlice.reducer;
