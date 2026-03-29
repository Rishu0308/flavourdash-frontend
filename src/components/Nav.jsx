import React, { useEffect, useState } from 'react'
import { FaLocationDot, FaPlus } from "react-icons/fa6"
import { IoIosSearch } from "react-icons/io"
import { FiShoppingCart } from "react-icons/fi"
import { RxCross2 } from "react-icons/rx"
import { TbReceipt2 } from "react-icons/tb"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { setSearchItems, setUserData } from '../redux/userSlice'

function Nav() {
  const navigate = useNavigate()
  const { userData, currentCity, cartItems } = useSelector(state => state.user)
  const [showInfo, setShowInfo] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const dispatch = useDispatch()
  const [query, setQuery] = useState("")
  const { myShopData } = useSelector(state => state.owner)
  const [pendingOrders, setPendingOrders] = useState(0);

useEffect(() => {
  const fetchPendingOrders = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/order/my-orders`, { withCredentials: true });

      // Flatten all shopOrders from each order and filter only this owner's shop orders
      let allShopOrders = [];
      res.data.forEach(order => {
        order.shopOrders.forEach(shopOrder => {
          if (shopOrder.owner === userData._id) {
            allShopOrders.push(shopOrder);
          }
        });
      });

      // Count only orders with these statuses
      const activeOrders = allShopOrders.filter(shopOrder =>
        ["pending", "preparing", "out for delivery"].includes(shopOrder.status)
      );

      setPendingOrders(activeOrders.length);
    } catch (error) {
      console.log("Error fetching pending orders:", error);
    }
  };

  if (userData?.role === "owner") {
    fetchPendingOrders();
  }
}, [userData]);

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
      dispatch(setUserData(null))
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearchItems = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`, { withCredentials: true })
      dispatch(setSearchItems(result.data))
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (query) {
      handleSearchItems()
    } else {
      dispatch(setSearchItems(null))
    }
  }, [query])

  return (
    <div className='w-full h-20 flex items-center justify-between md:justify-center gap-[30px]
      px-5 fixed top-0 z-9999 bg-[#fff9f6] overflow-visible'>

      {/* Mobile Search */}
      {showSearch && userData?.role === "user" && (
        <div className='w-[90%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-5 flex 
          fixed top-20 left-[5%] md:hidden'>
          <div className='flex items-center w-[30%] overflow-hidden gap-2.5 px-2.5 border-r-2 border-gray-400'>
            <FaLocationDot size={25} className='text-[#ff4d2d]' />
            <div className='w-[80%] truncate text-gray-600'>{currentCity}</div>
          </div>
          <div className='w-[80%] flex items-center gap-2.5'>
            <IoIosSearch size={25} className='text-[#ff4d2d]' />
            <input
              type="text"
              placeholder='search delicious food...'
              className='px-2.5 text-gray-700 outline-0 w-full'
              onChange={(e) => setQuery(e.target.value)} value={query} />
          </div>
        </div>
      )}

      {/* Logo */}
      <h1
        className='text-3xl font-bold mb-2 text-[#ff4d2d] cursor-pointer'
        onClick={() => navigate("/")}
      >
        Flavor Dash
      </h1>

      {/* Desktop Search */}
      {userData?.role === "user" && (
        <div className='md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-5 hidden md:flex'>
          <div className='flex items-center w-[30%] overflow-hidden gap-2.5 px-2.5 border-r-2 border-gray-400'>
            <FaLocationDot size={25} className='text-[#ff4d2d]' />
            <div className='w-[80%] truncate text-gray-600'>{currentCity}</div>
          </div>
          <div className='w-[80%] flex items-center gap-2.5'>
            <IoIosSearch size={25} className='text-[#ff4d2d]' />
            <input
              type="text"
              placeholder='search delicious food...'
              className='px-2.5 text-gray-700 outline-0 w-full'
              onChange={(e) => setQuery(e.target.value)} value={query} />
          </div>
        </div>
      )}

      {/* Right Side Section */}
      <div className='flex items-center gap-4 relative'>

        {/* Mobile Search Toggle */}
        {userData?.role === "user" && (
          showSearch ? (
            <RxCross2 size={25} className='text-[#ff4d2d] md:hidden' onClick={() => setShowSearch(false)} />
          ) : (
            <IoIosSearch size={25} className='text-[#ff4d2d] md:hidden' onClick={() => setShowSearch(true)} />
          )
        )}

        {/* Role-Based Section */}
        {userData?.role === "owner" ? (
          <>
            <button
              className='hidden md:flex items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]'
              onClick={() => navigate("/add-item")}
            >
              <FaPlus size={20} />
              <span>Add Food item</span>
            </button>

            <div
              className='hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d]'
              onClick={() => navigate("/my-orders")}
            >
              <TbReceipt2 size={20} />
              <span>My Order</span>
              <span className='absolute -right-2 -top-2 text-xs font-bold
              text-white bg-[#ff4d2d] rounded-full px-1.5 py-px'>{pendingOrders}</span>
            </div>
          </>
        ) : userData?.role === "user" ? (
          <>
            <div className='relative cursor-pointer' onClick={() => navigate("/cart")}>
              <FiShoppingCart size={25} className='text-[#ff4d2d]' />
              <span className='absolute right-[-9px] -top-3 text-[#ff4d2d] font-bold'>
                {cartItems?.length || 0}
              </span>
            </div>
            <button
              className='hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium'
              onClick={() => navigate("/my-orders")}
            >
              My Order
            </button>
          </>
        ) : null}

        {/* Avatar and Dropdown */}
        <div className='relative'>
          {/* Avatar Button */}
          <div
            className='w-10 h-10 rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer'
            onClick={() => setShowInfo(prev => !prev)}
          >
            {userData?.fullName?.slice(0, 1)}
          </div>

       {/* Dropdown - Appears just below avatar */}
{showInfo && (
  <div
    className='absolute top-[50px] right-0 bg-white shadow-2xl rounded-xl p-[15px] flex flex-col items-center w-[180px] z-9999'
  >
    <div className='text-[17px] font-semibold text-center whitespace-nowrap overflow-hidden text-ellipsis w-full'>
      {userData.fullName}
    </div>

    {/* Owner Mobile Options */}
    {userData?.role === "owner" && (
      <>
        <div
          className='md:hidden text-[#ff4d2d] font-semibold cursor-pointer mt-2 hover:underline w-full text-center'
          onClick={() => navigate("/add-item")}
        >
          Add Food Item
        </div>
        <div
          className='md:hidden text-[#ff4d2d] font-semibold cursor-pointer mt-2 hover:underline w-full text-center'
          onClick={() => navigate("/my-orders")}
        >
          My Order
        </div>
      </>
    )}

    {/* User Mobile Option */}
    {userData?.role === "user" && (
      <div
        className='md:hidden text-[#ff4d2d] font-semibold cursor-pointer mt-2 hover:underline w-full text-center'
        onClick={() => navigate("/my-orders")}
      >
        My Order
      </div>
    )}

    {/* Logout */}
    <div
      className='text-[#ff4d2d] font-semibold cursor-pointer mt-2 hover:underline w-full text-center'
      onClick={handleLogOut}
    >
      Log Out
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  )
}

export default Nav
