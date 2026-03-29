import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux';
import {setShopInMyCity} from '../redux/userSlice'
import { FaCity } from 'react-icons/fa6';
 
function useGetShopByCity() {
    const dispatch = useDispatch()
    const {currentCity} = useSelector(state => state.user)
    useEffect(() => {
        const fetchShop = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/shop/get-by-city/${currentCity}`, 
                { withCredentials: true })
               
                dispatch(setShopInMyCity(result.data))
                // console.log(result.data)
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchShop()
    }, [currentCity])
}
export default useGetShopByCity