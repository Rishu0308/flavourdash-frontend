import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../App";

function useGetCurrentUser() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("🟡 Fetching current user...");
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        console.log("🟢 Response:", result.data);
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log("🔴 Error fetching user:", error);
        dispatch(setUserData(null));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return loading;
}

export default useGetCurrentUser;
