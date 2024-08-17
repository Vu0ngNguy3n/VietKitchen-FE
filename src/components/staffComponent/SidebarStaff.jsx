import React, { useEffect, useState } from 'react'
import LOGO from "../../assests/VIET.png"
import { useNavigate } from 'react-router'
import { useUser } from '../../utils/constant';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { FaLocationDot } from 'react-icons/fa6';
import { BiSolidDish } from 'react-icons/bi';


const SidebarStaff = () => {

    const navigate = useNavigate();
    const [category, setCategory] = useState([]);
    const [userId, setUserId] = useState();
    const user = useUser();

    useEffect(() => {
        setUserId(user.accountId)
        axiosInstance
        .get(`/api/dish-category/${user.restaurantId}`)
        .then(res => {
            setCategory(res.data.result);
        })
        .catch((err) => {
          if (err.response) {
            const errorRes = err.response.data;
            toast.error(errorRes.message);
          } else if (err.request) {
            toast.error(err.request);
          } else {
            toast.error(err.message);
          }
        });
    },[])

    return (
        <div className='bg-primary px-[25px] h-screen relative'>
            <div className='px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3] '>
                <img src={LOGO} alt="" className="w-10 inline-block items-center rounded-full mr-2" />
                <h1 className='text-white text-[20px] leading-[24px] font-extrabold cursor-pointer'> VietKitchen</h1>
            </div>
            
            
            <div className='pt-[15px] border-b-[1px] border-[#EDEDED]/[0.3]'>
                <p className='text-[10px] font-extrabold leading-[16px] text-white/[0.4]'> Mặt hàng</p>
                <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer transition ease-in-out duration-300 rounded pl-4 hover:bg-secondary'
                    onClick={() => navigate(`/waiter/menu/all`)}>
                    <div className='flex items-center gap-[10px]'>
                        <BiSolidDish color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>Tất cả</p>
                    </div>
                </div>
                {category?.map((cate, index) => {
                    return (
                        <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer transition ease-in-out duration-300 rounded pl-4 hover:bg-secondary'
                            onClick={() => navigate(`/waiter/menu/${cate?.code}`)} 
                            key={index}>
                            <div className='flex items-center gap-[10px]'>
                                <BiSolidDish color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>{cate?.name}</p>
                            </div>
                            {/* <FaChevronRight color='white' /> */}
                        </div>
                    )
                })}
                <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer transition ease-in-out duration-300 rounded pl-4 hover:bg-secondary'
                    onClick={() => navigate(`/waiter/menu/combo`)}>
                    <div className='flex items-center gap-[10px]'>
                        <BiSolidDish color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>Combo</p>
                    </div>
                </div>

                
            </div>
            
            
        </div>
    )
}

export default SidebarStaff