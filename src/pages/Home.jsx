import React from 'react'
import { useSelector } from 'react-redux' 
import UserDashbord from '../component/UserDashboard'
import OwnerDashboard from '../component/OwnerDashboard'
import DeliveryBoy from '../component/DeliveryBoy'
import Nav from '../component/Nav'


export const Home = () => {
  const {userData} = useSelector(state => state.user)
  return (
    <div className='w-full min-h-[100vh] pt-[100px] flex flex-col items-center
    bg-[#fff9f6]'>
      
      {userData.role=="user" && <UserDashbord />}
      {userData.role=="owner" && <OwnerDashboard />}
      {userData.role=="DeliveryBoy" && <DeliveryBoy />}
      <Nav />
    </div>
  )
}
export default Home