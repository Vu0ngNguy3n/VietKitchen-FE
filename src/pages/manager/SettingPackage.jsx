import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard"
import SidebarManager from "../../components/managerComponent/SidebarManager"
import axiosInstance from "../../utils/axiosInstance";
import {  useUser } from "../../utils/constant";
import { formatVND } from "../../utils/format";
import CryptoJS from 'crypto-js';
import { IoIosArrowBack } from "react-icons/io";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { saveUser } from "../../actions/userActions";
import Loading from "../common/Loading/Loading";


function SettingPackage(){

    const [restaurantInformation, setRestaurantInformation] = useState();
    const [packageAbleToUpdate, setPackageAbleToUpdate] = useState();
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [packageUpdate, setPackageUpdate] = useState();
    const [monthUpdate, setMonthUpdate] = useState(1);
    const [requireMoney, setRequireMoney] = useState(0);
    const [isOpenRequire, setIsOpenRequire] = useState(false);
    const [responsePayment, setResponsePayment] = useState();
    const [paymentLink, setPaymentLink] = useState(null);
    const [status, setStatus] = useState();
    const [orderCode, setOrderCode] = useState();
    const [isCheck, setIsCheck] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const user = useUser();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        
        axiosInstance
        .get(`/api/restaurant/account/${user?.accountId}`)
        .then(res => {
            const data =res.data.result.restaurantPackage;
            setRestaurantInformation(data)
        })
        .catch(err => {
            if (err.response) {
                const errorRes = err.response.data;
                toast.error(errorRes.message);
            } else if (err.request) {
                toast.error("Request failed");
            } else {
                toast.error(err.message);
            }
        });

        axiosInstance
        .get(`/api/package/restaurant/${user?.restaurantId}`)
        .then(res => {
            const data =res.data.result?.packages;
            setPackageAbleToUpdate(data)
        })
        .catch(err => {
            if (err.response) {
                const errorRes = err.response.data;
                toast.error(errorRes.message);
            } else if (err.request) {
                toast.error("Request failed");
            } else {
                toast.error(err.message);
            }
        });

        const queryParams = new URLSearchParams(window.location.search);

        const status = queryParams.get('status');
        const orderCode = queryParams.get('orderCode');
        if (status === "PAID" && orderCode) {
            setStatus(status);
            setOrderCode(orderCode);
            const storePackage = JSON.parse(localStorage.getItem("packUpdate"));       
            const dataSend = {
                packageId: storePackage?.packId,
                restaurantId: user?.restaurantId,
                totalMoney: storePackage?.totalMoney,
                months: storePackage?.months,
                accountId: user?.accountId
            }
            axiosInstance
            .put(`/api/package-history/${orderCode}/success`,dataSend)
            .then(res => {
                toast.success("Bạn đã nâng cấp gói thành công")
                const token = res.data.result;
                const user = jwtDecode(token);
                localStorage.setItem('token', token);
                const userStorage = {
                    username: user.sub,
                    email: user.email,
                    role: user.scope,
                    accountId: user.accountId,
                    restaurantId: user.restaurantId,
                    packName: user.packName
                };
                // localStorage.setItem('user', JSON.stringify(userStorage));
                const action = saveUser(userStorage);
                dispatch(action);
                navigate("/manager/setting");
            })
            .catch(err => {
                if (err.response) {
                    const errorRes = err.response.data;
                    toast.error(errorRes.message);
                } else if (err.request) {
                    toast.error("Request failed");
                } else {
                    toast.error(err.message);
                }
            });
        }
    },[])


    const handleOpenPackageUpdate = (p) => {
        setIsOpenUpdate(true);
        setPackageUpdate(p);
    }

     const createSignature = (params, secretKey) => {
        const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');

        return CryptoJS.HmacSHA256(sortedParams, secretKey).toString(CryptoJS.enc.Hex);
    };

    const handleShowMoneyUpdate =async () => {
        if(isCheck){
            const data = {
                packId: packageUpdate?.id,
                months: monthUpdate
            }
            axiosInstance
            .post(`/api/restaurant/${user?.restaurantId}/pack/require-money`, data)
            .then(res => {
                const data =res.data.result;
                setRequireMoney(data);
                setIsCheck(false)
                setIsOpenRequire(true);
            })
            .catch(err => {
                if (err.response) {
                    const errorRes = err.response.data;
                    toast.error(errorRes.message);
                } else if (err.request) {
                    toast.error("Request failed");
                } else {
                    toast.error(err.message);
                }
            });
        }else{
            

            const apiUrl = 'https://api-merchant.payos.vn/v2/payment-requests'; 
            // const apiKey = 'a19ee99f-43c6-4228-b2b3-4c4e6cb450be'; // Thay bằng API Key của bạn
            const checkSumKey = "0e8ccdc617ecfbaa8d4f3af5a552c6976c515cdbe3b098edd4f281487cd3b807";
            const urlReturn = `https://vietkitchen.shop/manager/packageRestaurant`;
            const urlCancel = 'https://vietkitchen.shop/manager/packageRestaurant';
            const des = `${packageUpdate?.packName}`;
            const requestPack = {
                packageId: packageUpdate?.id,
                restaurantId: user?.restaurantId,
                totalMoney: requireMoney,
                months: monthUpdate
            }
            axiosInstance
            .post(`/api/package-history/create`, requestPack)
            .then(res => {
                const newOrderCode = res.data.result;
                console.log(newOrderCode);
                const payload = {
                    orderCode: newOrderCode,
                    amount: requireMoney, 
                    description: des,
                    returnUrl: urlReturn,
                    cancelUrl: urlCancel,
                };
                setIsLoading(true);
                const signature = createSignature(payload, checkSumKey)
                axios
                .post(apiUrl, {...payload, signature}, {
                    headers: { 
                        'x-client-id': 'd3d83bdb-eed9-4be9-8132-12a75380a5f3', 
                        'x-api-key': '4b36e11e-f3a3-417c-908a-28776f831bbe', 
                        'Content-Type': 'application/json',
                    },
                })
                .then(res => {
                    const data = res.data;
                    const dataUpdate = {
                        packId: packageUpdate?.id,
                        months: monthUpdate,
                        totalMoney: requireMoney
                    }
                    localStorage.setItem('packUpdate', JSON.stringify(dataUpdate));
                    setResponsePayment(data)
                    setIsLoading(false)
                })
                .catch(err => {
                    if (err.response) {
                        const errorRes = err.response.data;
                        setIsLoading(false)
                        toast.error(errorRes.message);
                    } else if (err.request) {
                        setIsLoading(false)
                        toast.error("Request failed");
                    } else {
                        setIsLoading(false)
                        toast.error(err.message);
                    }
                });
            })
            .catch(err => {
                if (err.response) {
                    const errorRes = err.response.data;
                    toast.error(errorRes.message);
                } else if (err.request) {
                    toast.error("Request failed");
                } else {
                    toast.error(err.message);
                }
            });

            
            
        }
    }

    useEffect(() => {
        if(responsePayment){
            const url = responsePayment?.data?.checkoutUrl;
            setPaymentLink(url);
            console.log(url);
             window.location.href = url;
        }
    },[responsePayment])
    

    const handleClosePackageUpdate = () => {
        setIsOpenUpdate(false);
        setRequireMoney(0);
        setIsOpenRequire(false);
        setMonthUpdate(0);
    }

    const onChangeMonths = (months) => {
           if(!isNaN(months) && months>0 ){
            setMonthUpdate(months)
            setIsCheck(true);
           }
    }

 
    return (
        <div className="">
            <div className="flex ">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarManager />
                </div>
                <div className="basis-[88%]  h-[100vh] overflow-scroll bg-primary/[0.1]">
                    <HeaderManagerDashboard />
                    <div className="min-w-[40]x rounded-lg  p-12 shadow min-h-[90vh] mt-2 flex-row  h-[100vh]">
                        <div className="flex items-center pb-3 border-b-2 border-slate-300">
                            <div className="flex items-center mr-2 cursor-pointer" onClick={() => navigate("/manager/setting")}><IoIosArrowBack className="size-6"/></div>
                            <h1 className="font-black text-2xl">Thông tin gói dịch vụ</h1>
                        </div>
                        <div className="flex justify-center mt-10 w-full border-b-2 border-b-slate-300 pb-8">
                            <div className="relative w-[50%] rounded-lg bg-white p-12 shadow min-h-10 mt-2">
                                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg">
                                    Gói hiện tại
                                </div>

                                <div className="flex gap-4 justify-center mt-6 flex-wrap">
                                    <img src='https://bizweb.dktcdn.net/100/102/351/files/iconpakagesoft.svg?v=1600332100283' alt="" className="w-[60%]"/>
                                    <div className="w-full justify-center flex flex-wrap">
                                        <div className="w-full flex justify-center">
                                            <h2 className="text-black uppercase font-semibold text-3xl">Gói {restaurantInformation?.packName}</h2>
                                        </div>
                                        <div className="w-full flex justify-center">
                                            <p className={`font-semibold text-black ${restaurantInformation?.pricePerMonth === 0 && "opacity-0"}`}>
                                                <s>{formatVND(restaurantInformation?.pricePerMonth)} /tháng</s>
                                            </p>
                                        </div>
                                        <div className="w-full flex justify-center border-b-2 pb-6">
                                            {restaurantInformation?.pricePerYear > 0 ? 
                                            <p className="flex items-end"><p className="text-blue-700 text-3xl font-extrabold">
                                                {formatVND(restaurantInformation?.pricePerYear)}
                                            </p> <p className="font-normal">/năm</p></p> : <p className="text-blue-700 text-3xl font-extrabold">Dùng thử 7 ngày</p>}
                                        </div>
                                    </div>
                                    <div className="w-full justify-center">
                                        <ul className="">
                                            {restaurantInformation?.permissions?.map((p, index) => {
                                                return <li key={index} className="text-center mb-3">{p?.description}</li>
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center w-full flex-wrap ">
                            <div className="pt-[15px] w-full flex justify-center"><p className="pt-[15px] text-[42px] text-[#42464e] font-light leading-4">Bảng giá gói phần mềm tính tiền, quản lý nhà hàng</p></div>
                            <div className="flex justify-center mt-10 w-full ">
                                {packageAbleToUpdate?.map((pack, index) => {
                                    return (
                                        <div className="relative w-[35%] rounded-lg bg-white p-12 shadow min-h-10 mt-2 mx-2" key={index}>
                                            {pack?.packName.toLowerCase().includes("premium") && <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg">
                                                Gói phổ biến
                                            </div> }
                                            <div className="flex gap-4 justify-center mt-6 flex-wrap">
                                                <img src='https://bizweb.dktcdn.net/100/102/351/files/iconpakagesoft.svg?v=1600332100283' alt="" className="w-[60%]"/>
                                                <div className="w-full justify-center flex flex-wrap">
                                                    <div className="w-full flex justify-center">
                                                        <h2 className="text-black uppercase font-semibold text-3xl">Gói {pack?.packName}</h2>
                                                    </div>
                                                    <div className="w-full flex justify-center">
                                                        <p className="font-semibold text-black"><s>{formatVND(pack?.pricePerMonth)} /tháng</s></p>
                                                    </div>
                                                    <div className="w-full flex justify-center border-b-2 pb-6">
                                                        <p className="flex items-end"><p className="text-blue-700 text-3xl font-extrabold">{formatVND(pack?.pricePerYear)}</p> <p className="font-normal">/năm</p></p>
                                                    </div>
                                                </div>
                                                <div className="w-full justify-center">
                                                    <ul className="">
                                                        {pack?.permissions?.map((p, index) => {
                                                            return <li key={index} className="text-center mb-3">{p?.description}</li>
                                                        })}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <button 
                                                        className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl "
                                                        onClick={() => handleOpenPackageUpdate(pack)}
                                                    >
                                                        Nâng cấp
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        

                    </div>
                </div>
                {isOpenUpdate && (
                    <div id="popup-delete" className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                        <div className="relative pt-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700 animate-slideIn">
                            <div className="w-full flex justify-center mb-4 border-b-2 pb-2">
                                <h2 className="font-semibold text-lg">Thông tin gói nâng cấp</h2>
                            </div>
                            <div className="flex-row">
                                <div className="flex justify-center">
                                    <div className="p-4 md:p-5 w-[70%]">
                                        <div className="w-full flex justify-center mb-3">
                                            <img src='https://bizweb.dktcdn.net/100/102/351/files/iconpakagesoft.svg?v=1600332100283' alt="" className="w-[60%]"/>
                                        </div>
                                        <div className="w-full flex mb-4">
                                            <div className="w-[60%]">
                                                <h3 className=" text-lg font-medium text-black dark:text-black">Tên gói:</h3>
                                            </div>
                                            <div className="w-[40%]">
                                                <h3 className=" text-lg font-semibold text-black dark:text-black">{packageUpdate?.packName.toUpperCase()}</h3>
                                            </div>
                                        </div>
                                        <div className="w-full flex mb-4">
                                            <div className="w-[60%] flex items-center">
                                                <h3 className=" text-lg font-medium text-black dark:text-black">Giá tiền:</h3>
                                            </div>
                                            <div className="w-[40%] flex items-center">
                                                <h3 className=" font-semibold text-black dark:text-black text-sm flex items-center"><s>{formatVND(packageUpdate?.pricePerMonth)} /tháng</s></h3>
                                            </div>
                                        </div>
                                        <div className="w-full flex mb-4">
                                            <div className="w-[60%] flex items-center">
                                                <h3 className=" text-lg font-medium text-black dark:text-black">Giá tiền:</h3>
                                            </div>
                                            <div className="w-[40%] flex items-center">
                                                <h3 className=" font-semibold text-black dark:text-black text-sm">{formatVND(packageUpdate?.pricePerYear)} /năm</h3>
                                            </div>
                                        </div>
                                        <div className="w-full flex mb-4 items-center">
                                            <div className="w-[60%] flex items-center" >
                                                <h3 className=" text-lg font-medium text-black dark:text-black">Số tháng:</h3>
                                            </div>
                                            <div className="w-[40%] flex items-center">
                                                <input 
                                                    type="text" 
                                                    placeholder="1"
                                                    className="w-[80%] border-b-2 border-black mr-2 outline-none"
                                                    value={monthUpdate}
                                                    onChange={(e) => onChangeMonths(e.target.value)}
                                                />
                                                <i className="font-medium">tháng</i>
                                            </div>
                                        </div>
                                        {isOpenRequire && (
                                            <div className="w-full flex mb-4">
                                                <div className="w-[60%] flex items-center">
                                                    <h3 className=" text-lg font-medium text-black dark:text-black">Số tiền cần:</h3>
                                                </div>
                                                <div className="w-[40%] flex items-center">
                                                    <h3 className=" font-semibold text-black dark:text-black text-sm">{formatVND(requireMoney)}</h3>
                                                </div>
                                            </div>
                                        )}
                                        {/* {paymentLink !== null && <a href={paymentLink}>{paymentLink}</a>} */}
                                    </div>
                                </div>
                                <div  className="border-t-2 w-full flex items-center rounded-b-md" >
                                    <div className="w-[50%] bg-blue-400 py-2 flex justify-center items-center rounded-bl-md cursor-pointer" onClick={() => handleShowMoneyUpdate()}>
                                        <p className="text-white font-medium" >{isCheck ? "Kiểm tra" : "Thanh toán"}</p>
                                    </div>
                                    <div className="w-[50%] bg-primary py-2 flex justify-center items-center rounded-br-md cursor-pointer" onClick={handleClosePackageUpdate}>
                                        <p className="text-white font-medium">Huỷ</p>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                )}

                {isLoading && (
                    <Loading/>
                )}
            </div>
        </div>
    )
}

export default SettingPackage