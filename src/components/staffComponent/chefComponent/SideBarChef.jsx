import React, { useEffect, useState } from 'react'
import LOGO from "../../../assests/VIET.png"
import { BiSolidDish } from "react-icons/bi";
import { useNavigate } from 'react-router'
import { getUser } from '../../../utils/constant';


const SidebarChef = () => {

    const navigate = useNavigate();
    const [category, setCategory] = useState([]);
    const [userId, setUserId] = useState();

    

    return (
        <div className='bg-primary px-[25px] h-screen relative'>
            <div className='px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3] '>
                <img src={LOGO} alt="" className="w-10 inline-block items-center rounded-full mr-2" />
                <h1 className='text-white text-[20px] leading-[24px] font-extrabold cursor-pointer'> VietKitchen</h1>
            </div>
            
            <div className='pt-[15px] border-b-[1px] border-[#EDEDED]/[0.3]'>
                <p className='text-[10px] font-extrabold leading-[16px] text-white/[0.4]'>Quản lý món ăn chuẩn bị</p>
                
                        <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer transition ease-in-out duration-300 rounded pl-4 hover:bg-secondary'
                            onClick={() => navigate('/chef/dishPreparation')}
                        >
                            <div className='flex items-center gap-[10px]'>
                                <BiSolidDish color='white' /> <p className='text-[12px] leading-[20px] font-normal text-white'>Món ăn chuẩn bị</p>
                            </div>
                        </div>
                        <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer transition ease-in-out duration-300 rounded pl-4 hover:bg-secondary'
                            onClick={() => navigate('/chef/dishTables')}
                        >
                            <div className='flex items-center gap-[10px]'>
                                <BiSolidDish color='white' /> <p className='text-[12px] leading-[20px] font-normal text-white'>Món ăn theo bàn</p>
                            </div>
                        </div>
                        <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer transition ease-in-out duration-300 rounded pl-4 hover:bg-secondary'
                            onClick={() => navigate('/chef/dishConfirm')}
                        >
                            <div className='flex items-center gap-[10px]'>
                                <BiSolidDish color='white' /> <p className='text-[12px] leading-[20px] font-normal text-white'>Món đã hoàn thành</p>
                            </div>
                        </div>
                        <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer transition ease-in-out duration-300 rounded pl-4 hover:bg-secondary'
                            onClick={() => navigate('/chef/dishDecline')}
                        >
                            <div className='flex items-center gap-[10px]'>
                                <BiSolidDish color='white' /> <p className='text-[12px] leading-[20px] font-normal text-white'>Món đã từ chối</p>
                            </div>
                        </div>

                
              
                
            </div>
            
        </div>
    )
}

export default SidebarChef