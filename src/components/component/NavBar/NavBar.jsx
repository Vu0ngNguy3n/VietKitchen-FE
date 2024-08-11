import { useNavigate } from "react-router";
import LOGO from "../../../assests/VIET.png"
import { GrLanguage } from "react-icons/gr";
import { FaBars, FaXmark } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { clearUser } from "../../../actions/userActions";
import { useUser } from "../../../utils/constant";



const NavBar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userStorage, setUserStorage] = useState();
    const dispatch = useDispatch();
    const user = useUser();

    useEffect(() =>{
        // const storedUser = localStorage.getItem('user');
        // const user = storedUser ? JSON.parse(storedUser) : null
        setUserStorage(user);
    },[])

    const hanldeLogout = () => {
        // localStorage.removeItem('user');
        const action = clearUser();
        dispatch(action);
        localStorage.removeItem('token');
        setUserStorage(null);
        toast.success("Đăng xuất thành công")
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }
    const navItems = [
        { link: "Tổng quát", path: "home" },
        { link: "Chức năng", path: "feature" },
        { link: "Nền tảng", path: "about" },
        { link: "Bảng giá", path: "pricing" },
    ]

    return (
        <>
            <nav className="bg-white md:px-14 p-4 w-full mx-auto text-primary fixed top-0 right-0 left-0" >
                <div className="text-lg container mx-auto flex justify-between items-cente font-medium">
                    <div className="flex space-x-14 items-center">
                        <a href="#" className="text-2x1 font-semibold flex items-center space-x-3 text-primary">
                            <img src={LOGO} alt="" className="w-10 inline-block items-center rounded-full" />
                            <span className="text-[#5961F9]" >Viet <span className="text-[#EE9AE5]">Kitchen</span></span>
                        </a>

                        <ul className="md:flex space-x-12 hidden">
                            {
                                navItems.map(({ link, path }) =>
                                    <Link className="block hover:text-gray-300 cursor-pointer" activeClass="active" spy={true} smooth={true} offset={-100} key={link} to={path}>{link}</Link>
                                )}
                        </ul>
                    </div>

                    <div className="space-x-12 hidden md:flex items-center">
                        {userStorage !== null ?<a  className="hidden lg:flex items-center hover:text-secondary cursor-pointer" onClick={() => toast.success("success")}>Hello, {userStorage?.username}</a> : ''}
                        {userStorage !== null ?<button className="bg-secondary py-2 px-4 transition-all duration-300 rounded hover:text-white hover:bg-indigo-600 " onClick={() => hanldeLogout()}>Đăng xuất</button>:<button className="bg-secondary py-2 px-4 transition-all duration-300 rounded hover:text-white hover:bg-indigo-600 " onClick={() => navigate("/login")}>Đăng nhập</button>}
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => toggleMenu()} className="text-white  focus:outline-none focus:text-gray-300">
                            {
                                isMenuOpen ? (<FaXmark className="w-6 h-6 text-primary" />)
                                    : (<FaBars className="w-6 h-6 text-primary " />)
                            }
                        </button>
                    </div>
                </div>


            </nav>
            <div className={`space-y-4 px-4 text-xl pt-24 pb-5 bg-secondary ${isMenuOpen ? 'block fixed top-0 right-0 left-0' : "hidden"}`}>
                {
                    navItems.map(({ link, path }) =>
                        <Link className="block hover:text-gray-300 cursor-pointer text-white" activeClass="active" 
                            spy={true} smooth={true} offset={-80} key={link} to={path}
                            onClick={toggleMenu}
                        >{link}</Link>
                    )}
            </div>
        </>
    )
}

export default NavBar;