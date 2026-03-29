import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast"; // ✅ Toast provider
import { io } from "socket.io-client";
import { setSocket } from "./redux/userSlice";

// ✅ Pages
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import CreateEditShop from "./pages/CreateEditShop";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import CartPage from "./pages/CartPage";
import CheckOut from "./pages/CheckOut";
import OrderPlaced from "./pages/OrderPlaced";
import MyOrders from "./pages/MyOrders";
import TrackOrderPage from "./pages/TrackOrderPage";
import Shop from "./pages/Shop";

// ✅ Hooks
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import useGetCity from "./hooks/useGetCity";
import useGetMyShop from "./hooks/useGetMyShop";
import useGetShopByCity from "./hooks/useGetShopByCity";
import useGetItemsByCity from "./hooks/useGetItemsByCity";
import useGetMyOrders from "./hooks/useGetMyOrders";
import useUpdateLocation from "./hooks/useUpdateLocation";
import DeliveryBoy from "./components/DeliveryBoy";

export const serverUrl = "http://localhost:8000";

function App() {
  const dispatch = useDispatch();
  const { userData, socket } = useSelector((state) => state.user);
  const loading = useGetCurrentUser();

  // ✅ Initialize all other hooks
  useGetCity();
  useGetMyShop();
  useGetShopByCity();
  useGetItemsByCity();
  useGetMyOrders();
  useUpdateLocation();

  // 🔹 1️⃣ Create and store socket only once
  useEffect(() => {
    const socketInstance = io(serverUrl, { withCredentials: true });
    dispatch(setSocket(socketInstance));

    socketInstance.on("connect", () => {
      // console.log(" Socket connected:", socketInstance.id);
      if (userData){
        socketInstance.emit('identity', {userId:userData._id})
      }
    })
    return () => {
      socketInstance.disconnect();
      
    };
  }, [userData?._id]);

  // 🔹 2️⃣ Emit identity when userData becomes available
  useEffect(() => {
    if (userData?._id && socket) {
      console.log("📡 Emitting identity for user:", userData._id);
      socket.emit("identity", { userId: userData._id });
    }
  }, [userData, socket]);

  // 🔹 3️⃣ Dynamic document title by user role
  useEffect(() => {
    if (!userData || !userData.role) {
      document.title = "FlavorDash || Fast. Fresh. Flavorful.";
      return;
    }

    const titles = {
      user: "FlavorDash || Welcome, Foodie!",
      owner: "FlavorDash || Manage Your Restaurant",
      deliveryboy: "FlavorDash || Deliver Orders Quickly",
    };

    document.title = titles[userData.role] || "FlavorDash || Fast. Fresh. Flavorful.";
  }, [userData]);

  // 🔹 4️⃣ Show loading message while session checking
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        session is loading
      </div>
    );
  }

  // 🔹 5️⃣ Decide home route based on user role
  const getHomeRoute = () => {
    if (!userData) return <Navigate to="/signin" />;
    switch (userData.role) {
      case "owner":
        return <Home />;
      case "deliveryboy":
        return <DeliveryBoy />;
      default:
        return <Home />;
    }
  };

  // 🔹 6️⃣ Render app routes
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/signin"
          element={!userData ? <SignIn /> : <Navigate to="/" />}
        />
        <Route
          path="/forgot-password"
          element={!userData ? <ForgotPassword /> : <Navigate to="/" />}
        />

        {/* Protected Routes */}
        <Route path="/" element={getHomeRoute()} />
        <Route
          path="/create-edit-shop"
          element={userData ? <CreateEditShop /> : <Navigate to="/signin" />}
        />
        <Route
          path="/add-item"
          element={userData ? <AddItem /> : <Navigate to="/signin" />}
        />
        <Route
          path="/edit-item/:itemId"
          element={userData ? <EditItem /> : <Navigate to="/signin" />}
        />
        <Route
          path="/cart"
          element={userData ? <CartPage /> : <Navigate to="/signin" />}
        />
        <Route
          path="/checkout"
          element={userData ? <CheckOut /> : <Navigate to="/signin" />}
        />
        <Route
          path="/order-placed"
          element={userData ? <OrderPlaced /> : <Navigate to="/signin" />}
        />
        <Route
          path="/my-orders"
          element={userData ? <MyOrders /> : <Navigate to="/signin" />}
        />
        <Route
          path="/track-order/:orderId"
          element={userData ? <TrackOrderPage /> : <Navigate to="/signin" />}
        />
        <Route
          path="/shop/:shopId"
          element={userData ? <Shop /> : <Navigate to="/signin" />}
        />

        {/* Delivery Boy route */}
        <Route
          path="/delivery-boy"
          element={
            userData?.role === "deliveryboy" ? <DeliveryBoy /> : <Navigate to="/" />
          }
        />
      </Routes>
    </>
  );
}

export default App;
