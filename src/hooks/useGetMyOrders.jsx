import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyOrders } from "../redux/userSlice";

function useGetMyOrders() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    // Only fetch when the user is logged in
    if (!userData?._id) return;

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/order/my-orders`, {
          withCredentials: true,
        });

        dispatch(setMyOrders(response.data));
        console.log("Fetched orders:", response.data);
      } catch (error) {
        console.error("Error fetching orders:", error.response?.data || error.message);
      }
    };

    fetchOrders();
  }, [userData?._id, dispatch]);
}

export default useGetMyOrders;
