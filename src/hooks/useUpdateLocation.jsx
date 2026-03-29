import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";

function useUpdateLocation() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("❌ Geolocation not supported by this browser.");
      return;
    }

    const updateLocation = async (lat, lon) => {
      try {
        const result = await axios.post(
          `${serverUrl}/api/user/update-location`,
          { lat, lon },
          { withCredentials: true }
        );
        // console.log("Updated location:", result.data.location);
      } catch (err) {
        console.error(" Location update error:", err.response?.data || err.message);
      }
    };

    const successHandler = (pos) => {
      updateLocation(pos.coords.latitude, pos.coords.longitude);
    };

    const errorHandler = (err) => {
      switch (err.code) {
        case err.PERMISSION_DENIED:
          console.error(" User denied location access.");
          break;
        case err.POSITION_UNAVAILABLE:
          console.error(" Location info unavailable.");
          break;
        case err.TIMEOUT:
          console.error(" Geolocation timeout — try increasing timeout duration.");
          break;
        default:
          console.error(" Unknown geolocation error:", err.message);
      }
    };

    // Watch for position updates
    const watcherId = navigator.geolocation.watchPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 15000,
    });
    return () => navigator.geolocation.clearWatch(watcherId);
  }, [userData, dispatch]);
}

export default useUpdateLocation;
