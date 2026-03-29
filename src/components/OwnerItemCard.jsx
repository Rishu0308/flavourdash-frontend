import React from 'react'
import { FaPen } from "react-icons/fa6";
import { FaTrashAlt, FaRupeeSign } from "react-icons/fa"; 
import { useNavigate } from 'react-router-dom';
import { setMyShopData } from '../redux/ownerSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';

function OwnerItemCard ({data}){
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async() => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/item/delete/${data._id}`,
        { withCredentials: true }
      );
      dispatch(setMyShopData(result.data));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='flex bg-white rounded-2xl shadow-lg overflow-hidden border border-[#ff4d2d]/50 w-full max-w-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1'>
      {/* Image Section */}
      <div className='w-40 h-full shrink-0 bg-gray-100'>
        <img src={data.image} alt={data.name} className='w-full h-40 object-cover rounded-l-2xl'/>
      </div>

      {/* Details Section */}
      <div className='flex flex-col justify-between p-4 flex-1'>
        <div>
          <h2 className='text-lg font-bold text-gray-800'>{data.name}</h2>
          <p className='text-sm text-gray-600'>
            <span className='font-medium text-gray-700'>Category: </span>{data.category}
          </p>
          <p className='text-sm text-gray-600 flex items-center gap-2'>
            <span className='font-medium text-gray-700'>Food Type: </span> 
            {/* Color-coded food type */}
            <span className='flex items-center gap-1'>
              <span 
                className={`w-3 h-3 rounded-full ${data.foodType.toLowerCase() === "veg" ? "bg-green-500" : "bg-red-500"}`}
              ></span>
              {data.foodType}
            </span>
          </p>
        </div>

        {/* Price + Actions */}
        <div className='flex items-center justify-between mt-3'>
          <div className='flex items-center text-[#ff4d2d] font-semibold text-lg'>
            <FaRupeeSign className="mr-1" /> {data.price}
          </div>

          <div className='flex items-center gap-3'>
            <div
              className='p-2 rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d] cursor-pointer transition-colors'
              onClick={() => navigate(`/edit-item/${data._id}`)}
            >
              <FaPen size={16} />
            </div>
            <div
              className='p-2 rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d] cursor-pointer transition-colors'
              onClick={handleDelete}
            >
              <FaTrashAlt size={16}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OwnerItemCard
