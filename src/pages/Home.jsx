import React from 'react'
import { useSelector } from 'react-redux' 
import UserDashbord from '../components/UserDashboard'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoy from '../components/DeliveryBoy'
import Nav from '../components/Nav'


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