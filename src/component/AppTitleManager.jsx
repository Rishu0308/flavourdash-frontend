import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function AppTitleManager() {
  const { userData } = useSelector((state) => state.user); // assumes userData.role exists

  useEffect(() => {
    if (!userData || !userData.role) {
      document.title = "FlavorDash || Fast. Fresh. Flavorful.";
      return;
    }

    const titles = {
      User: "FlavorDash || Welcome, Foodie!",
      Owner: "FlavorDash || Manage Your Restaurant",
      deliveryboy: "FlavorDash || Deliver Orders Quickly",
    };

    document.title = titles[userData.role] || "FlavorDash || Fast. Fresh. Flavorful.";
  }, [userData]);

  return null; // this doesn't render anything
}

export default AppTitleManager;
