import React from 'react'
import { FaTachometerAlt, FaRegSun, FaWrench, FaStickyNote, FaRegChartBar, FaRegCalendarAlt, FaChevronRight, FaChevronLeft, FaBolt } from "react-icons/fa"
import { MdDashboard } from 'react-icons/md'
import { useNavigate } from 'react-router'
import LOGO from "../../assests/VIET.png"

const Sidebar = () => {

    const navigate = useNavigate();

    return (
        <div className='bg-primary px-[25px] h-screen'>
            <div className='px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3]'>
                <img src={LOGO} alt="" className="w-10 inline-block items-center rounded-full mr-2" />
                <h1 className='text-white text-[20px] leading-[24px] font-extrabold cursor-pointer'>VietKitchen</h1>
            </div>
            <div className='flex items-center gap-[15px] py-[20px] border-b-[1px] transition ease-in-out duration-300 rounded pl-4 hover:bg-secondary border-[#EDEDED]/[0.3] cursor-pointer ' onClick={() => navigate('/admin/dashboard')}>
                <MdDashboard color='white' />
                <p className='text-[14px] leading-[20px] font-bold text-white '>Tổng quan</p>
            </div>
            <div className='pt-[15px] border-b-[1px] border-[#EDEDED]/[0.3]'>
                <p className='text-[10px] font-extrabold leading-[16px] text-white/[0.4]'> Dịch vụ</p>
                <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer transition ease-in-out duration-300 rounded pl-4 hover:bg-secondary' onClick={() => navigate("/admin/packages")}>
                    <div className='flex items-center gap-[10px]'>
                        <FaRegSun color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white' >Quản lý gói</p>
                    </div>
                    {/* <FaChevronRight color='white' /> */}
                </div>
                {/* <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer transition ease-in-out duration-300 rounded pl-4 hover:bg-secondary' onClick={() => navigate("/admin/permissions")}>
                    <div className='flex items-center gap-[10px]'>
                        <FaWrench color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>Quản lý chức năng</p>
                    </div>
                </div> */}
            </div>
            <div className='pt-[15px] border-b-[1px] border-[#EDEDED]/[0.3]'>
                <p className='text-[10px] font-extrabold leading-[16px] text-white/[0.4]'> Người dùng</p>
                <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer transition ease-in-out duration-300 rounded pl-4 hover:bg-secondary' onClick={() => navigate("/admin/accountsManagement")}>
                    <div className='flex items-center gap-[10px]'>
                        <FaStickyNote color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>Danh sách</p>
                    </div>
                    {/* <FaChevronRight color='white' /> */}
                </div>
                {/* <div className='flex items-center gap-[10px] py-[15px]  cursor-pointer transition ease-in-out duration-300 rounded pl-4 hover:bg-secondary'>
                    <FaRegChartBar color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>Charts</p>
                </div>
                <div className='flex items-center gap-[10px] py-[15px] cursor-pointer transition ease-in-out duration-300 rounded pl-4 hover:bg-secondary'>
                    <FaRegCalendarAlt color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>Tables</p>
                </div> */}
            </div>
            <div className='pt-[15px]'>
                <div className='flex items-center justify-center' onClick={( ) => navigate("/")}>
                    <div className='h-[40px] w-[40px] bg-[#3C5EC1] rounded-full flex items-center justify-center cursor-pointer'>
                        <FaChevronLeft color='white' />
                    </div>
                </div>
            </div>
            {/* <div className='bg-[#395CBF] mt-[15px] flex items-center justify-center flex-col py-[15px] px-[10px] gap-[15px] rounded-[3px]'>
                <FaBolt color='white' />
                <p className='text-[12px] leading-[18px] font-normal text-white/[0.4] text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, soluta.</p>
                <button className='bg-[#17A673] text-white flex items-center justify-center h-[30px] w-full rounded-[3px] text-[14px] leading-[21px] font-normal'>Upgrade to Pro!</button>

            </div> */}
        </div>
    )
}

export default Sidebar