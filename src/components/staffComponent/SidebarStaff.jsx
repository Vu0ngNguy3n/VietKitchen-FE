import React, { useEffect, useState } from 'react'
import LOGO from "../../assests/VIET.png"
import { FaFileInvoiceDollar, FaUserAlt, FaWrench, FaListAlt , FaStickyNote, FaRegChartBar, FaRegCalendarAlt, FaChevronRight, FaChevronLeft, FaBolt, FaUserFriends, FaMap } from "react-icons/fa"
import { MdCategory } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { useNavigate } from 'react-router'
import { PiUniteFill } from "react-icons/pi";
import { IoSettings } from "react-icons/io5";
import { useUser } from '../../utils/constant';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';


const SidebarStaff = () => {

    const navigate = useNavigate();
    const [category, setCategory] = useState([]);
    const [userId, setUserId] = useState();
    const user = useUser();

    useEffect(() => {
        setUserId(user.accountId)
        axiosInstance
        .get(`/api/dish-category/${user.accountId}`)
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

                
                
                {/* <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer transition ease-in-out duration-300 rounded pl-4 hover:bg-secondary'
                    onClick={() => navigate("/manager/categories")}>
                    <div className='flex items-center gap-[10px]'>
                        <MdCategory color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>Thực đơn</p>
                    </div>
                    {/* <FaChevronRight color='white' /> */}
                {/* </div> */}
                {/* <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer transition ease-in-out duration-300 rounded pl-4 hover:bg-secondary'
                    onClick={() => navigate("/manager/combos")}>
                    <div className='flex items-center gap-[10px]'>
                        <FaListAlt  color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>Combo</p>
                    </div>
                </div> 
                */}
                
            </div>
            
        </div>
    )
}

export default SidebarStaff