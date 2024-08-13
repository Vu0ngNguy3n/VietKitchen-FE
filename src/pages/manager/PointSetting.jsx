import { useEffect, useState } from "react";
import { GrUpdate } from "react-icons/gr";
import { useNavigate } from "react-router";
import SidebarManager from "../../components/managerComponent/SidebarManager";
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard";
import { IoIosArrowBack } from "react-icons/io";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useUser } from "../../utils/constant";
import { FaArrowRight } from "react-icons/fa";
import { NumericFormat } from "react-number-format";

function PointSetting() {

    const navigate = useNavigate();
   
    const [restaurantInformation, setRestaurantInformation] = useState('');
    const [moneyToPoint, setMoneyToPoint] = useState('');
    const [pointToMoney, setPointToMoney] = useState('');
    const [pointDefault, setPointDefault] = useState(1);
    const user = useUser();

    useEffect(() => {
        axiosInstance
        .get(`/api/restaurant/account/${user?.accountId}`)
        .then(res => {
            const data = res.data.result;
            setRestaurantInformation(data);     
            setMoneyToPoint(data.moneyToPoint);
            setPointToMoney(data.pointToMoney);
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

    const handleChangeMoneyToPoint = (value) => {
        if(!isNaN(value)){
            const numericValue = value.replace(/[^0-9]/g, '');
            setMoneyToPoint(numericValue);
        }
    } 

    const handleChangePointToMoney = (value) => {
        if(!isNaN(value)){
            const numericValue = value.replace(/[^0-9]/g, '');
            setPointToMoney(numericValue);
        }
    }

    const handleSubmitChange =() => {
        if(pointToMoney === '' || moneyToPoint === ''){
            toast.warn("Thông tin điểm thưởng không được để trống")
            return 
        }

        const request = {
            moneyToPoint: +moneyToPoint,
            pointToMoney: +pointToMoney
        }

        axiosInstance
        .put(`/api/restaurant/${user.restaurantId}/point`, request)
        .then(res => {
            toast.success("Cập nhật thiết lập tích điểm thành công");
            navigate("/manager/setting")
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

    }

    return (
        <div>
            <div className="flex">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarManager />
                </div>
                <div className="basis-[88%] border h-[100vh] overflow-scroll">
                    <HeaderManagerDashboard />
                    <div className="min-w-[40]x rounded-lg bg-primary/[0.1] p-16 shadow min-h-[90vh]  mt-2 flex-row ">
    
                        <div className="min-w-[40]x rounded-lg bg-white p-16 shadow min-h-[40vh] mt-2 relative">
                            <div className="absolute top-2 left-2 cursor-pointer flex text-gray-500" onClick={() => navigate("/manager/setting")}><IoIosArrowBack className="size-6"/> <span className="font-medium">Thiết lập nhà hàng</span></div>
                            <h1 className="font-black text-3xl mb-8">Quản lý điểm</h1>

                            <div className="grid gap-4 mb-4 grid-cols-2 w-full">
                                <div className="w-[60%]">
                                    <span className="font-normal w-full">Thiết lập điểm quy đổi cho khách hàng trong quá trình bán hàng.</span>
                                </div>
                                <div className="w-[100%] bg-gray-300 p-4">
                                    <div className="border-b-2 py-3 w-full flex">
                                        <span className="flex w-full font-semibold text-base">
                                            Giá trị quy đổi điểm
                                        </span>
                                    </div>
                                    <div className="border-b-2 py-3 w-full flex items-center">
                                        <span className="flex w-[45%] font-semibold text-base">
                                            Tỉ lệ quy đổi điểm thưởng
                                        </span>
                                        <div className="w-[55%] flex items-center justify-between">
                                            <div className="flex w-[45%] ">
                                                <NumericFormat
                                                    value={moneyToPoint}
                                                    thousandSeparator=","
                                                    displayType="input"
                                                    onValueChange={(values) => handleChangeMoneyToPoint(values.value)}
                                                    className="w-full outline-none px-1 py-2 rounded-l-md"
                                                />
                                                {/* <input type="text" className="w-full outline-none px-1 py-2 rounded-l-md" value={moneyToPoint} /> */}
                                                <div className="px-1 py-2 bg-blue-500 rounded-r-md">
                                                    <span className="text-white font-medium uppercase text-sm w-[30%]">VNĐ</span>
                                                </div>
                                            </div> 
                                            <div><FaArrowRight /></div>
                                            <div className="flex w-[45%]">
                                                <span className="font-medium">1 điểm thưởng</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" py-3 w-full flex items-center">
                                        <span className="flex w-[45%] font-semibold text-base">
                                            Tỉ lệ thanh toán bằng điểm
                                        </span>
                                        <div className="w-[55%] flex items-center justify-between">
                                            <div className="flex w-[45%] ">
                                                <input type="text" className="w-full outline-none px-1 py-2 rounded-l-md disabled:bg-white" disabled value={pointDefault} />
                                                <div className="px-1 py-2 bg-orange-500 rounded-r-md">
                                                    <span className="text-white font-medium text-sm w-[30%]">Điểm</span>
                                                </div>
                                            </div> 
                                            <div><FaArrowRight /></div>
                                            <div className="flex w-[45%] ">
                                                <NumericFormat
                                                    value={pointToMoney}
                                                    thousandSeparator=","
                                                    displayType="input"
                                                    onValueChange={(values) => handleChangePointToMoney(values.value)}
                                                    className="w-full outline-none px-1 py-2 rounded-l-md"
                                                />
                                                <div className="px-1 py-2 bg-blue-500 rounded-r-md">
                                                    <span className="text-white font-medium uppercase text-sm w-[30%]">VNĐ</span>
                                                </div>
                                            </div> 
                                        </div>
                                    </div>
                                    <div className="mt-6 w-full flex justify-end">
                                        <button
                                            onClick={() => handleSubmitChange()} 
                                            className="outline-none px-6 py-3 bg-blue-500 cursor-pointer duration-300 transition-all rounded-md text-white font-medium hover:opacity-80">Xác nhận</button>
                                    </div>
                                </div>
                            </div>

                            
                        </div>
                    </div>
                </div>
            </div>
             <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideIn {
                    from {
                        transform: translateY(-20%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-in-out;
                }

                .animate-slideIn {
                    animation: slideIn 0.3s ease-in-out;
                }
            `}</style>
        </div>
    )
}

export default PointSetting
