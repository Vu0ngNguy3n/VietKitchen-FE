import React, { useState } from 'react'
import { FaSearch, FaEnvelope, FaRegBell } from "react-icons/fa"
import { useNavigate } from 'react-router'
import profile from "../../assests/profile-user.svg"
import LOGO from "../../assests/VIET.png"


const Dashboardview = () => {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate();

    const showProfile = () => {
        // alert("helloo")
        setOpen(!open)
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        // localStorage.removeItem('user');
        navigate('/login')
    }

    return (
        <div className=''>
            <div className='flex items-center justify-between h-[70px] shadow-lg px-[25px] '>
                <div className='flex items-center rounded-[5px]'>
                    {/* <input type="text" className=' bg-[#F8F9FC] h-[40px] outline-none pl-[13px] w-[350px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal' placeholder='Search for...' />
                    <div className='bg-[#4E73DF] h-[40px] px-[14px] flex items-center justify-center cursor-pointer rounded-tr-[5px] rounded-br-[5px]'>
                        <FaSearch color='white' />
                    </div> */}

                </div>
                <div className='flex items-center gap-[20px]'>
                    <div className='flex items-center gap-[25px] border-r-[1px] pr-[25px]'>
                        {/* <FaRegBell />
                        <FaEnvelope /> */}
                    </div>
                    <div className='flex items-center gap-[15px] relative' onClick={showProfile} >
                        <p className='font-semibold'>ADMIN</p>
                        <div className='h-[50px] w-[50px] rounded-full bg-[#4E73DF] cursor-pointer flex items-center justify-center relative z-40' >
                            <img src={LOGO} alt="" className='rounded-full w-full' />

                        </div>

                        {
                            open &&
                            <div className='bg-white border h-[120px] w-[180px] absolute bottom-[-135px] z-20 right-0 pt-[15px] pl-[15px] space-y-[10px]'>
                                <p className='cursor-pointer hover:text-[blue] font-semibold' onClick={() => navigate('/admin/dashboard')}>Tổng quan</p>
                                <p className='cursor-pointer hover:text-[blue] font-semibold' onClick={() => navigate('/admin/packages')}>Quản lý gói</p>
                                <p className='cursor-pointer hover:text-[blue] font-semibold' onClick={() => handleLogout()}>Đăng xuất</p>
                            </div>

                        }



                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboardview