import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NavBarStaff from "../../../components/staffComponent/NavBarStaff";
import SidebarStaff from "../../../components/staffComponent/SidebarStaff";
import { FaUserCircle } from "react-icons/fa";
import { LuTicket } from "react-icons/lu";
import { FaQrcode } from "react-icons/fa";
import { FcMoneyTransfer } from "react-icons/fc";
import {formatVND} from '../../../utils/format'
import axiosInstance from "../../../utils/axiosInstance";
import { MdArrowBackIosNew } from "react-icons/md";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";


function Payment() {
 
    const table = useSelector(state => state.table)
    const orderId = useSelector(state => state.orderId);
    const [customerPay, setCustomerPay] = useState(0);
    const [remainMoney, setRemainMoney] = useState(0);
    const [discountMoney, setDiscountMoney] = useState(0);
    const [customerPoint, setCustomerPoint] = useState(0);
    const [requireMoney, setRequireMoney] = useState(0);
    const [isQR, setIsQR] = useState(true);
    const [orderDetail, setOrderDetail] = useState();
    const customerDetail = useSelector(state => state.customer);
    const navigate = useNavigate();

    useEffect(()=>{
        axiosInstance
        .get(`/api/order/${orderId}`)
        .then(res => {
            const data = res.data.result;
            setOrderDetail(data);
            setCustomerPoint(data.customer.point)
            setRequireMoney(data.totalMoney)
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

    const joinNumber = (value) => {
        setCustomerPay(customerPay+value);
        console.log(customerPay+value);
    }

    const clearCustomerPay = () => {
        setCustomerPay(0);
    }

    const deleteNumber = () => {
        const newCustomerPay = customerPay.slice(0,-1);
        setCustomerPay(newCustomerPay);
    }

    useEffect(() => {
        setRemainMoney(customerPay-requireMoney);
    },[customerPay])

  return (
    <div className="flex h-screen">
      
      <div className="w-full border overflow-scroll">
        <NavBarStaff/>
        <div className="h-full w-full bg-slate-300 flex justify-center ">
            <div className="w-[70%] h-[65%] bg-white mt-10 shadow-lg">
                <div className="flex justify-between py-4 bg-white w-full h-[12%] items-center">
                    <div className="w-[5%] flex justify-center items-center cursor-pointer" onClick={() => navigate("/waiter/ordering")}>
                        <MdArrowBackIosNew className=" size-6"/>
                    </div>
                    <div>
                        <b className="font-bold ">Thanh toán - {table?.areaName} - {table?.tableName}</b>
                    </div>
                    <div className="w-[5%]">

                    </div>
                </div>

                <div className="w-full h-[80%] bg-gray-200 p-2 flex justify-between">
                    <div className="w-[33%] h-full ">
                        <div className="flex-row bg-white rounded-md px-4 py-3 h-[27%] mb-[2%]">
                            <div className="flex items-center mb-2">
                                <FaUserCircle className="mr-3"/>
                                <span className="font-semibold">{customerDetail?.name}</span>
                            </div>
                            <div className="flex items-center ">
                                <LuTicket className="mr-3"/>
                                <span className="font-semibold">Điểm tích luỹ: {(customerPoint).toLocaleString('vi-VN')} điểm</span>
                            </div>
                        </div>
                        <div className="bg-white rounded-md h-[70%] flex w-full justify-around">
                            <div 
                                className={`w-[30%] h-[35%] mt-4 flex border-2 px-3 py-1 justify-center items-center cursor-pointer transition-all duration-300 ${isQR?'border-blue-700' : ''}`}
                                onClick={() => setIsQR(true)}    
                            >
                                <div className="flex-row">
                                    <div className="flex justify-center">
                                        <FaQrcode className="size-9"/>
                                    </div>
                                    <div className="flex justify-center">
                                        <span className="font-semibold">QR</span>
                                    </div>
                                </div>
                            </div>
                            <div 
                                className={`w-[30%] h-[35%] mt-4 flex border-2 px-3 py-1 justify-center items-center cursor-pointer transition-all duration-300 ${isQR?'':'border-blue-700'}`}
                                onClick={() => setIsQR(false)}    
                            >
                                <div className="flex-row">
                                    <div className="flex justify-center">
                                        <FcMoneyTransfer className="size-9"/>
                                    </div>
                                    <div className="flex justify-center">
                                        <span className="font-semibold">Tiền mặt</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-[33%] bg-white h-full rounded-md flex-row">
                        <div className="p-2">
                            <div className="bg-slate-300 w-full rounded-sm py-4 font-semibold opacity-60 mb-2">
                                <div className="flex justify-between px-2 items-center">
                                    <span>Tổng tiền {'('}5{')'}</span>
                                    <span>{formatVND(requireMoney)}</span>
                                </div>
                            </div>
                             <div className="bg-slate-300 w-full rounded-sm py-4 font-semibold opacity-60 mb-2">
                                <div className="flex justify-between px-2 items-center">
                                    <span>Sử dụng điểm</span>
                                    <span>{(customerPoint).toLocaleString('vi-VN')}</span>
                                </div>
                            </div>
                             <div className="bg-slate-300 w-full rounded-sm py-4 font-semibold  mb-2">
                                <div className="flex justify-between px-2 items-center">
                                    <span>Cần thanh toán</span>
                                    <span>{formatVND(requireMoney)}</span>
                                </div>
                            </div>
                            {!isQR && <>
                                <div className=" w-full  font-semibold mb-2">
                                    <div className="flex justify-between items-center">
                                        <div className="w-[45%] pl-2">
                                            <span>Khách trả</span>
                                        </div>
                                        <div className="">
                                            <input 
                                                type="text" 
                                                value={formatVND(customerPay)}
                                                // onChange={(e) => setCustomerPay(e.target.value)}
                                                className='px-2 py-3 border-2 border-secondary text-secondary outline-none rounded-sm text-right cursor-default'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className=" w-full  font-semibold mb-2">
                                    <div className="flex justify-between items-center">
                                        <div className="w-[45%] pl-2">
                                            <span>Tiền thừa</span>
                                        </div>
                                        <div className=" w-[55%] py-3 flex justify-end">
                                            <span className="text-black mr-2">{formatVND(remainMoney)}</span>
                                        </div>
                                    </div>
                                </div>
                            </>}
                            
                        </div>
                    </div>
                    <div className={`w-[33%] h-full ${isQR ? "hidden" : ""}`}>
                        <div className="flex justify-between h-[35%]">
                            <div className="w-[68%] flex flex-wrap justify-between">
                                <div 
                                    className="w-[32%] bg-white rounded-md flex justify-center items-center py-3 mb-2 hover:bg-secondary transition-all duration-300 cursor-pointer"
                                    onClick={() => joinNumber("7")}
                                >
                                    <span className="font-semibold" >7</span>
                                </div>
                                <div 
                                    className="w-[32%] bg-white rounded-md flex justify-center items-center py-3 mb-2 hover:bg-secondary transition-all duration-300 cursor-pointer"
                                    onClick={() => joinNumber("8")}
                                    >
                                    <span className="font-semibold" >8</span>
                                </div>
                                <div 
                                    className="w-[32%] bg-white rounded-md flex justify-center items-center py-3 mb-2 hover:bg-secondary transition-all duration-300 cursor-pointer"
                                    onClick={() => joinNumber("9")}>
                                    <span className="font-semibold" >9</span>
                                </div>
                                <div 
                                    className="w-[32%] bg-white rounded-md flex justify-center items-center py-3 mb-2 hover:bg-secondary transition-all duration-300 cursor-pointer"
                                    onClick={() => joinNumber("4")}>
                                    <span className="font-semibold" >4</span>
                                </div>
                                <div 
                                    className="w-[32%] bg-white rounded-md flex justify-center items-center py-3 mb-2 hover:bg-secondary transition-all duration-300 cursor-pointer"
                                    onClick={() => joinNumber("5")}
                                >
                                    <span className="font-semibold" >5</span>
                                </div>
                                <div
                                     className="w-[32%] bg-white rounded-md flex justify-center items-center py-3 mb-2 hover:bg-secondary transition-all duration-300 cursor-pointer"
                                     onClick={() => joinNumber("6")}
                                >
                                    <span className="font-semibold" >6</span>
                                </div>
                            </div>
                            <div 
                                className="w-[30%] h-[95%]"
                                onClick={() => {deleteNumber()}}>
                                <div className="bg-white rounded-md flex justify-center items-center h-full py-3 mb-2 hover:bg-secondary transition-all duration-300 cursor-pointer">
                                  <span className="font-semibold">x</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between h-[35%]">
                            <div className="w-[68%] flex flex-wrap justify-between">
                                <div
                                    className="w-[32%] bg-white rounded-md flex justify-center items-center py-3 mb-2 hover:bg-secondary transition-all duration-300 cursor-pointer"
                                    onClick={() => joinNumber("1")}
                                >
                                      <span className="font-semibold" >1</span>
                                </div>
                                <div 
                                    className="w-[32%] bg-white rounded-md flex justify-center items-center py-3 mb-2 hover:bg-secondary transition-all duration-300 cursor-pointer"
                                    onClick={() => joinNumber("2")}>
                                    <span className="font-semibold" >2</span>
                                </div>
                                <div 
                                    className="w-[32%] bg-white rounded-md flex justify-center items-center py-3 mb-2 hover:bg-secondary transition-all duration-300 cursor-pointer"
                                    onClick={() => joinNumber("3")}
                                >
                                    <span className="font-semibold">3</span>
                                </div>
                                <div 
                                    className="w-[32%] bg-white rounded-md flex justify-center items-center py-3 mb-2 hover:bg-secondary transition-all duration-300 cursor-pointer"
                                    onClick={() => joinNumber("000")}
                                >
                                    <span className="font-semibold" >000</span>
                                </div>
                                <div 
                                    className="w-[32%] bg-white rounded-md flex justify-center items-center py-3 mb-2 hover:bg-secondary transition-all duration-300 cursor-pointer"
                                    onClick={() => joinNumber("0")}
                                >
                                    <span className="font-semibold" >0</span>
                                </div>
                                <div className="w-[32%] bg-white rounded-md flex justify-center items-center py-3 mb-2 hover:bg-secondary transition-all duration-300 cursor-pointer">
                                    <span className="font-semibold">.</span>
                                </div>
                            </div>
                            <div className="w-[30%] h-[95%]" onClick={() => clearCustomerPay()}>
                                <div className="bg-white rounded-md flex justify-center items-center h-full py-3 mb-2 hover:bg-secondary transition-all duration-300 cursor-pointer">
                                    <span className="font-semibold">C</span>
                                </div>
                            </div>
                        </div>       
                    </div>

                    <div className={`w-[33%] h-full bg-white rounded-md  ${isQR ? "flex justify-center items-center" : "hidden"}`}>
                        <div className="">
                            <div className="border-2 border-black p-3 rounded mb-4">
                                <FaQrcode className="size-32"/>                                
                            </div>
                            <div className="flex justify-center">
                                <span className="font-semibold">Ngân hàng</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center cursor-pointer h-[12%] bg-secondary">
                    <span className="font-semibold text-white">Xác nhận thanh toán</span>
                </div>
            </div> 
        </div>
      </div>
    </div>
  );
}

export default Payment;

