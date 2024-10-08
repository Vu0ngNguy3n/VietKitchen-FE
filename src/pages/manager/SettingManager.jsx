import SidebarManager from "../../components/managerComponent/SidebarManager"
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard"
import { FaShop } from "react-icons/fa6";
import { MdChair, MdManageAccounts } from "react-icons/md";
import { PiUniteFill } from "react-icons/pi";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { useNavigate } from "react-router";
import { MdOutlinePayment } from "react-icons/md";
import { FiPackage } from "react-icons/fi";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { FaKey } from "react-icons/fa";


function SettingManager() {

    const navigate = useNavigate();

    return (
        <div className="">
            <div className="flex ">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarManager />
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <HeaderManagerDashboard />
                    <div className="min-w-[40]x rounded-lg bg-primary/[0.1] p-16 shadow min-h-[90vh] mt-2 flex-row ">
                        <div className="flex justify-between">
                            <h1 className="font-black text-3xl">Thiết lập nhà hàng</h1>
                        </div>
                        <div className="flex justify-center mt-10">
                            <div className="w-[60%] rounded-lg bg-white p-16 shadow min-h-10 mt-2">
                                <div className="flex justify-between">
                                    <h1 className="font-black text-xl">Thiết lập thông tin</h1>

                                </div>
                                <div className="flex gap-4 justify-between mt-6 flex-wrap">
                                    <div className='flex items-center gap-[10px] basis-[40%]'>
                                        <FaShop color='black ' size={35} />
                                        <div className="flex-row">
                                            <p 
                                            className='text-[16px] leading-[20px] font-extrabold text-secondary/[0.7] cursor-pointer'
                                            onClick={() => navigate('/manager/restaurantInformation')}
                                            >Thông tin nhà hàng</p>
                                            <span>Xem và điều chỉnh thông tin nhà hàng của bạn</span>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-[10px] basis-[40%]'>
                                        <FaKey color='black ' size={35} />
                                        <div className="flex-row">
                                            <p 
                                            className='text-[16px] leading-[20px] font-extrabold text-secondary/[0.7] cursor-pointer'
                                            onClick={() => navigate('/manager/changePassword')}
                                            >Đổi mật khẩu </p>
                                            <span>Đổi mật khẩu cho nhà hàng của bạn</span>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-[10px] basis-[40%]'>
                                        <MdOutlinePayment  color='black ' size={35} />
                                        <div className="flex-row">
                                            <p 
                                                className='text-[16px] leading-[20px] font-extrabold text-secondary/[0.7] cursor-pointer'
                                                onClick={() => navigate('/manager/paymentSetting')}
                                            >
                                                Thiết lập thanh toán
                                            </p>
                                            <span>Xem và điều chỉnh thông tin thanh toán của nhà hàng.</span>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-[10px] basis-[40%]'>
                                        <FiPackage  color='black ' size={35} />
                                        <div className="flex-row">
                                            <p 
                                                className='text-[16px] leading-[20px] font-extrabold text-secondary/[0.7] cursor-pointer'
                                                onClick={() => navigate('/manager/packageRestaurant')}
                                            >
                                                Thông tin gói
                                            </p>
                                            <span>Xem và và nâng cấp gói cho nhà hàng.</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="flex justify-center mt-10 mb-20">
                            <div className="w-[60%] rounded-lg bg-white p-16 shadow min-h-10 mt-2">
                                <div className="flex justify-between">
                                    <h1 className="font-black text-xl">Thiết lập chức năng</h1>

                                </div>
                                <div className="flex gap-4 flex-wrap justify-between mt-6">
                                    <div className='flex items-center gap-[10px] basis-[40%]'>
                                        <PiUniteFill  color='black ' size={35} />
                                        <div className="flex-row">
                                            <p className='text-[16px] leading-[20px] font-extrabold text-secondary/[0.7] cursor-pointer' onClick={() => navigate('/manager/units')}>Thiết lập đơn vị</p>
                                            <span>Xem và thiết lập đơn vị tính của bạn</span>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-[10px] basis-[40%]'>
                                        <RiMoneyDollarCircleFill color='black ' size={35} />
                                        <div className="flex-row">
                                            <p className='text-[16px] leading-[20px] font-extrabold text-secondary/[0.7] cursor-pointer' onClick={() => navigate('/manager/VATSetting')}>Thiết lập thuế</p>
                                            <span>Xem và thiết lập thuế bán hàng của nhà hàng</span>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-[10px] basis-[40%]'>
                                        <BiSolidPurchaseTag color='black ' size={35} />
                                        <div className="flex-row">
                                            <p className='text-[16px] leading-[20px] font-extrabold text-secondary/[0.7] cursor-pointer' onClick={() => navigate('/manager/PointSetting')}>Thiết lập điểm</p>
                                            <span>Xem và thiết lập điểm của nhà hàng</span>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-[10px] basis-[40%]'>
                                        <MdChair color='black ' size={35} />
                                        <div className="flex-row">
                                            <p className='text-[16px] leading-[20px] font-extrabold text-secondary/[0.7] cursor-pointer' onClick={() => navigate('/manager/areaManagement')}>Thiết lập khu vực</p>
                                            <span>Xem và thiết lập, chỉnh sửa các khu vực trong nhà hàng</span>
                                        </div>
                                    </div>
                                    
                                </div>

                            </div>
                        </div>

                    </div>
                </div>


            </div>
        </div>
    )
}

export default SettingManager
