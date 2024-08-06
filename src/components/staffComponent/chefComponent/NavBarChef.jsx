import React, { useEffect, useState } from 'react'
import { FaSearch, FaEnvelope, FaRegBell } from "react-icons/fa"
import { useNavigate } from 'react-router'
import profile from "../../../assests/profile-user.svg"
import { FaCartShopping } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import CHEFAVATAR from "../../../assests/chefAvartar.png"


const NavBarChef = () => {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate();
    const [userStorage, setUserStorage] = useState();
    const cartList = useSelector(state => state.cart)

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
            <div className='flex items-center justify-between h-[70px] border-b-2 px-[25px] '>
                <div className='flex items-center rounded-[5px]'>
                    

                </div>
                <div className='flex items-center gap-[20px]'>
                    
                    <div className='flex items-center gap-[15px] relative' onClick={showProfile} >
                        <p className='font-semibold'>{userStorage?.username}</p>
                        <div className='h-[50px] w-[50px] rounded-full bg-[#4E73DF] cursor-pointer flex items-center justify-center relative z-40' >
                            <img src={CHEFAVATAR} alt="" />

                        </div>

                        {
                            open &&
                            <div className='bg-white border h-[120px] w-[150px] absolute bottom-[-135px] z-20 right-0 pt-[15px] pl-[15px] space-y-[10px]'>
                                <p className='cursor-pointer hover:text-[blue] font-semibold'>Profile</p>
                                {/* <p className='cursor-pointer hover:text-[blue] font-semibold'>Settings</p> */}
                                <p className='cursor-pointer hover:text-[blue] font-semibold' onClick={() => handleLogout()}>Đăng xuất</p>
                            </div>

                        }



                    </div>
                </div>
            </div>

          
        </div>
    )
}

export default NavBarChef