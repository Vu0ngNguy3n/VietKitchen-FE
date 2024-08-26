import React, { useEffect, useState } from 'react'
import { FaSearch, FaEnvelope, FaRegBell } from "react-icons/fa"
import { useNavigate } from 'react-router'
import profile from "../../assests/profile-user.svg"
import { FaCartShopping } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import WAITERAVATAR from "../../assests/waiterAvatar.png"
import { clearUser } from '../../actions/userActions';
import { useUser } from '../../utils/constant';


const NavBarStaff = () => {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate();
    const [userStorage, setUserStorage] = useState();
    const orderId = useSelector(state => state.orderId);
    // const cartList = useSelector(state => state.cart)
    const user = useUser();
    const dispatch = useDispatch();

    useEffect(() =>{
        // const storedUser = localStorage.getItem('user');
        // const user = storedUser ? JSON.parse(storedUser) : null
        setUserStorage(user);
    },[])

    const showProfile = () => {
        // alert("helloo")
        setOpen(!open)
    }

    const handleLogout = ( ) => {
        localStorage.removeItem('token');
        // localStorage.removeItem('user');
        const action = clearUser();
        dispatch(action);
        navigate('/login')
    }

    return (
        <div className=''>
            <div className='flex items-center justify-between h-[70px] border-b-2 px-[25px] '>
                <div className='flex items-center rounded-[5px]'>
                    

                </div>
                <div className='flex items-center gap-[20px]'>
                    <div className='flex items-center gap-[25px] border-r-[1px] pr-[25px]'>
                        <div className={`flex items-center pr-2 justify-between gap-[10px] py-[15px] cursor-pointer transition ease-in-out duration-300 rounded pl-4 hover:text-secondary ${orderId !== null ? '' : 'hidden'}`}
                            onClick={() => navigate("/waiter/ordering")}>
                                <FaCartShopping  /> <p className='text-[14px] font-semibold leading-[20px]  '>Giỏ hàng</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-[15px] relative' onClick={showProfile} >
                        <p className='font-semibold'>{userStorage?.username}</p>
                        <span className='font-semibold text-sm uppercase'>Bồi bàn</span>
                        <div className='h-[50px] w-[50px] rounded-full bg-[#4E73DF] cursor-pointer flex items-center justify-center relative z-40' >
                            <img src={WAITERAVATAR} alt=""  className='rounded-full w-full h-full object-cover'/>

                        </div>

                        {
                            open &&
                            <div className='bg-white border h-[120px] w-[150px] absolute bottom-[-135px] z-20 right-0 pt-[15px] pl-[15px] space-y-[10px]'>
                                <p className='cursor-pointer hover:text-[blue] font-semibold' onClick={() => handleLogout()}>Đăng xuất</p>
                            </div>

                        }



                    </div>
                </div>
            </div>

          
        </div>
    )
}

export default NavBarStaff