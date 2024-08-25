import logo from "../../../assests/VIET.png"
import instagram from "../../../assests/instagram.png"
import facebook from "../../../assests/faIcon.png"
import twitter from "../../../assests/twitter.jpg"


const Footer = () => {
    return (
        <div className="bg-[#010851] md:px-14 p-4 w-full  mx-auto  text-white">
            <div className="my-12 flex flex-col md:flex-row gap-10 " >
                <div className="md:w-1/2 space-y-8">
                    <a href="/" className="text-2xl font-semibold flex items-center space-x-3 text-primary">
                        <img src={logo} alt="" className="w-10 max-w-[500px] rounded-full inline-block items-center" />
                        <span className="text-white">VietKitchen</span>
                    </a>

                    <p className="md:w-1/2 ">Phần mềm quản lí nhà hàng VietKitchen sẽ đem dến cho nhà hàng của bạn sự tiện ích, tối ưu hoá thời gian trong khâu quản lí khách hàng và gọi món.</p>
                    <div>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email của bạn"
                            className="bg-[#9a7af159] py-2 px-4 rounded-md focus:outline-none"
                        />
                        <input
                            type="submit"
                            value={"Subcribe"}
                            className="px-4 py-2 bg-secondary rounded-md -ml-2 cursor-pointer hover:bg-white hover:text-primary duration-300 transition-all" />
                    </div>
                </div>

                <div className="md:w-1/2 flex flex-col md:flex-row flex-wrap justify-between gap-8 items-start">
                    <div className="space-y-4 mt-5">
                        <h4 className="text-xl">Hỏi đáp</h4>
                        <ul className="space-y-3">
                            <a  className="block hover:text-gray-300">Cách sử dụng?</a>
                            <a  className="block hover:text-gray-300">Giá của các gói?</a>
                            <a  className="block hover:text-gray-300">Làm thể nào để dùng thử?</a>
                            <a  className="block hover:text-gray-300">Mục đích của trang web?</a>
                        </ul>
                    </div>
                    <div className="space-y-4 mt-5">
                        <h4 className="text-xl">Nền tảng</h4>
                        <ul className="space-y-3">
                            <a  className="block hover:text-gray-300">Tổng quát</a>
                            <a  className="block hover:text-gray-300">Chức năng</a>
                            <a  className="block hover:text-gray-300">Nền tảng</a>
                            <a  className="block hover:text-gray-300">Bảng giá</a>
                        </ul>
                    </div>
                    <div className="space-y-4 mt-5">
                        <h4 className="text-xl">Liên hệ</h4>
                        <ul className="space-y-3">
                            <p className=" hover:text-gray-300">(+84) 888-637-937</p>
                            <p className=" hover:text-gray-300">Số 7, ngách 5, đường Hoàng Đan</p>
                            <p className=" hover:text-gray-300">Cửa Lò, Nghệ An</p>
                            <p className=" hover:text-gray-300">vietkitchenservice@gmail.com</p>
                        </ul>
                    </div>
                </div>
            </div>

            <hr />

            <div className="flex flex-col sm:flex-row gap-8 sm:items-center justify-between my-8">
                <p>@VietKitchen 2024. All rights reserved</p>
                <div className="flex items-center space-x-5">
                    <img src={facebook} alt="" className="w-8 cursor-pointer hover: translate-y-4 
                    transition-all duration-300 rounded-lg"/>
                    <img src={instagram} alt="" className="w-8 cursor-pointer hover: translate-y-4 
                    transition-all duration-300"/>
                    <img src={twitter} alt="" className="w-8 cursor-pointer hover: translate-y-4 
                    transition-all duration-300"/>
                    
                </div>
            </div>
        </div>
    )
}

export default Footer