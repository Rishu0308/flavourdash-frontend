import React, { useState, useEffect } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';
import toast from "react-hot-toast"; 

function EditItem() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { itemId } = useParams();

  const [currentItem, setCurrentItem] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState(null);
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    "Snacks", "Main Course", "Desserts", "Pizza", "Burgers", "Sandwiches", "South Indian",
    "North Indian", "Chinese", "Fast Food", "Other"
  ];

  // Handle image selection
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  // Fetch item details
  useEffect(() => {
    const handleGetItemById = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/item/get-by-id/${itemId}`, {
          withCredentials: true,
        });
        setCurrentItem(result.data);
      } catch (error) {
        console.error("Fetch item error:", error);
      }
    };
    handleGetItemById();
  }, [itemId]);

  // Set form fields when currentItem updates
  useEffect(() => {
    if (currentItem) {
      setName(currentItem.name || "");
      setPrice(currentItem.price || "");
      setCategory(currentItem.category || "");
      setFoodType(currentItem.foodType || "");
      setFrontendImage(currentItem.image || "");
    }
  }, [currentItem]);

  // Handle form submit (Edit Item)
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Check if any field has changed
    const hasChanges =
      name !== currentItem?.name ||
      price !== currentItem?.price ||
      category !== currentItem?.category ||
      foodType !== currentItem?.foodType ||
      backendImage;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("foodType", foodType);
    formData.append("price", price);
    if (backendImage) formData.append("image", backendImage);

    const result = await axios.post(
      `${serverUrl}/api/item/edit-item/${itemId}`,
      formData,
      { withCredentials: true }
    );

    if (result.data?.shop) {
      dispatch(setMyShopData(result.data.shop));

      // ✅ Show success message even if nothing changed
      if (hasChanges) {
        toast.success("🍽️ Item updated successfully!", {
          position: "bottom-right",
        });
      } else {
        toast("ℹ️ No changes detected.", {
          position: "bottom-right",
        });
      }
    }

    navigate("/");
  } catch (error) {
    console.error("Edit item error:", error);
    toast.error("❌ Failed to update item!", {
      position: "bottom-right",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen">
      {/* Back Button */}
      <div
        className="absolute top-[20px] left-[20px] z-[10] mb-[10px] cursor-pointer"
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
      </div>

      {/* Card */}
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border-orange-100">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <FaUtensils className="text-[#ff4d2d] w-16 h-16" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900">
            Edit Food
          </div>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Food Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter Food Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>

          {/* Food Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={handleImage}
            />
            {frontendImage && (
              <div className="mt-4">
                <img
                  src={frontendImage}
                  alt="Food Preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              placeholder="0"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Category</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cate, index) => (
                <option value={cate} key={index}>{cate}</option>
              ))}
            </select>
          </div>

          {/* Food Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Food Type</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setFoodType(e.target.value)}
              value={foodType}
              required
            >
              <option value="">Select Type</option>
              <option value="veg">Veg</option>
              <option value="non-veg">Non Veg</option>
            </select>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200
              ${loading
                ? "bg-orange-300 text-white cursor-not-allowed"
                : "bg-[#ff4d2d] text-white hover:bg-orange-600 hover:shadow-lg cursor-pointer"
              }`}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Save"}
          </button>
        </form>
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

export default EditItem;
