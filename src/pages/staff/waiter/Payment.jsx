import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { getUser } from "../../../utils/constant";
import {clearTable} from "../../../actions/tableActions"
import {clearOrderId} from "../../../actions/orderActions"
import {clearCart} from "../../../actions/cartActions"
import {clearCustomer} from "../../../actions/customerActions"
import GREEN_CHECK from "../../../assests/greenCheck.png"
import axios from "axios";


function Payment() {
 
    const table = useSelector(state => state.table)
    const orderId = useSelector(state => state.orderId);
    const user = getUser();
    const [customerPay, setCustomerPay] = useState(0);
    const [remainMoney, setRemainMoney] = useState(0);
    const [discountMoney, setDiscountMoney] = useState(0);
    const [customerPoint, setCustomerPoint] = useState(0);
    const [requireMoney, setRequireMoney] = useState(0);
    const [isQR, setIsQR] = useState(true);
    const [orderDetail, setOrderDetail] = useState();
    const customerDetail = useSelector(state => state.customer);
    const [managerInformation, setManagerInformation] = useState();
    const [QRCodeImg, setQRCodeImg] = useState();
    const [isOpenPopUp, setIsOpenPopUp] = useState(false);
    const [isOpenSuccessPayment, setIsOpenSuccessPayment] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

         axiosInstance
        .get(`/api/restaurant/account/${user?.accountId}`)
        .then(res => {
            const data = res.data.result; 
            setManagerInformation(data);
        })
        .catch(err => {
            if (err.response) {
                const errorRes = err.response.data;
                toast.error(errorRes.message);
            } else if (err.request) {
                toast.error("Yêu cầu không thành công");
            } else {
                toast.error(err.message);
            }
        })
    },[])

    useEffect(()=>{
        const dataPayment = {
            accountNo: managerInformation?.account_NO,
            accountName: managerInformation?.account_NAME,
            acqId: managerInformation?.bank_ID,
            amount: requireMoney,
            addInfo: "Ung Ho Dinh Hoan",
            format: "text",
            template: "compact2"
        }
        if(dataPayment?.accountName !== undefined){
            axios
            .post(`https://api.vietqr.io/v2/generate`,dataPayment,{
                headers: { 
                        'x-client-id': '752aa61c-e3c9-4b9c-8828-ff2711468e66', 
                        'x-api-key': '630e1ee3-7cf6-4279-9b11-16eae4b8c4e7', 
                        'Content-Type': 'application/json',
                    },
            })
            .then(res => {
                setQRCodeImg(res.data.data?.qrDataURL);
            })
            .catch(err => {
                if (err.response) {
                    const errorRes = err.response.data;
                    toast.error(errorRes.message);
                } else if (err.request) {
                    toast.error("Yêu cầu tạo QR không thành công");
                } else {
                    toast.error(err.message);
                }
            })
        }
    },[requireMoney, managerInformation])

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

    const handleOpenPopUp = () => {
        setIsOpenPopUp(true);
    }

    const handleClosePopUp = () => {
        setIsOpenPopUp(false);
    }

    const handleCreateBill = () => {
        const dataBill = {
            total: requireMoney,
            methodPayment: isQR?"BANKING":"MONEY"
        }
        console.log(dataBill);
        
        axiosInstance
        .post(`/api/bill/create/order/${orderId}`, dataBill)
        .then(res => {
            console.log(res.data);
            toast.success("Thanh toán thành công");
            // navigate("/waiter/map");
            handleClosePopUp();
            handleOpenSuccessPayment();
        })
        .catch(err => {
                if (err.response) {
                    const errorRes = err.response.data;
                    toast.error(errorRes.message);
                } else if (err.request) {
                    toast.error("Yêu cầu tạo QR không thành công");
                } else {
                    toast.error(err.message);
                }
            })
    }

    const handleOpenSuccessPayment = () => {
        setIsOpenSuccessPayment(true);
    }

    const handleCloseSuccessPayment = () => {
        const actionTable = clearTable();
        dispatch(actionTable);
        const actionOrder = clearOrderId();
        dispatch(actionOrder);
        const actionCart = clearCart();
        dispatch(actionCart);
        const actionCustomer = clearCustomer();
        dispatch(actionCustomer);
        setIsOpenSuccessPayment(false)
        navigate("/waiter/map")
    }

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
                            <div className="flex justify-center">
                                {/* <FaQrcode className="size-32"/>                                 */}
                                <img src={QRCodeImg} className='w-[80%]' alt="" />
                            </div>
                            {/* <div className="flex justify-center">
                                <span className="font-semibold">Ngân hàng</span>
                            </div> */}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center cursor-pointer h-[12%] bg-secondary" onClick={() => handleOpenPopUp()}>
                    <span className="font-semibold text-white">Xác nhận thanh toán</span>
                </div>
            </div> 
            {isOpenPopUp && (
                <div id="popup-delete" className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                                <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700 animate-slideIn">
                                    <button type="button" onClick={handleClosePopUp} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                    <div className="p-4 md:p-5 text-center">
                                        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                        </svg>
                                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Xác nhận thanh toán thành công</h3>
                                        <button 
                                            data-modal-hide="popup-modal" 
                                            type="button" 
                                            onClick={() => handleCreateBill()}
                                            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                            Có
                                        </button>
                                        <button 
                                            data-modal-hide="popup-modal" 
                                            type="button" 
                                            onClick={handleClosePopUp}
                                            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            Không
                                        </button>
                                    </div>
                                </div>
                            </div>
            )}
            {isOpenSuccessPayment && (
                <div id="popup-delete" className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                    <div className="relative pt-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700 animate-slideIn">
                        <div className="w-full flex justify-center mb-4 border-b-2 pb-2">
                            <h2 className="font-semibold text-lg">Hoàn tất hoá đơn -  {table?.areaName} - {table?.tableName}</h2>
                        </div>
                        <div className="flex-row">
                            <div className="flex justify-center">
                                <div className="p-4 md:p-5 text-center w-[80%]">
                                    <div className="w-full flex justify-center mb-3">
                                        <img src={GREEN_CHECK} alt="" className="w-[12%] " />
                                    </div>
                                    <h3 className="mb-5 text-lg font-semibold text-black dark:text-black">Thanh toán hoá đơn thành công</h3>
                                    <div className="flex justify-center w-full mb-8">
                                        <div className="flex justify-between w-[83%]">
                                            <p className="font-medium">Tiền khách trả</p>
                                            <span className="font-semibold ">{formatVND(requireMoney)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t-2 flex justify-center py-2 items-center bg-blue-400 cursor-pointer rounded-b-md" onClick={() => handleCloseSuccessPayment()}>
                                <p className="text-white font-medium">Hoàn tất</p>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
            )}
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
  );
}

export default Payment;

