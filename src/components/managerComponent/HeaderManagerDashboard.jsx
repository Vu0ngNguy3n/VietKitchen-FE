import React, { useEffect, useState } from 'react'
import { FaSearch, FaEnvelope, FaRegBell } from "react-icons/fa"
import { useNavigate } from 'react-router'
import profile from "../../assests/profile-user.svg"

const HeaderManagerDashboard = () => {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate();
    const [userStorage, setUserStorage] = useState();

    useEffect(() =>{
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null
        setUserStorage(user);
    },[])

    const showProfile = () => {
        // alert("helloo")
        setOpen(!open)
    }

    const handleLogout = ( ) => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
                    {/* <div className='flex items-center gap-[25px] border-r-[1px] pr-[25px]'>
                        <FaRegBell />
                        <FaEnvelope />
                    </div> */}
                    <div className='flex items-center gap-[15px] relative'  >
                        <div className='flex flex-col items-center justify-center mr-3'>
                            <p className='font-semibold'>{userStorage?.username}</p>
                            <i>Gói <span className='text-blue-600 underline text-base cursor-pointer' onClick={() => navigate('/manager/packageRestaurant')}> {userStorage?.packName}</span></i>
                        </div>
                        <div className='h-[50px] w-[50px] rounded-full bg-[#4E73DF] cursor-pointer flex items-center justify-center relative z-40' onClick={showProfile}>
                            <img src={profile} alt="" />

                        </div>

                        {
                            open &&
                            <div className='bg-white border h-[120px] w-[150px] absolute bottom-[-135px] z-20 right-0 pt-[15px] pl-[15px] space-y-[10px]'>
                                {/* <p className='cursor-pointer hover:text-[blue] font-semibold'>Profile</p> */}
                                <p className='cursor-pointer hover:text-[blue] font-semibold' onClick={() => navigate('/manager/setting')}>Thiết lập</p>
                                <p className='cursor-pointer hover:text-[blue] font-semibold' onClick={() => handleLogout()}>Đăng xuất</p>
                            </div>

                        }



                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderManagerDashboard