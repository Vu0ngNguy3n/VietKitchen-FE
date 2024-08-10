import axios from "axios";
import { useEffect, useState } from "react";
import { GrUpdate } from "react-icons/gr";
import { useNavigate } from "react-router";
import SidebarManager from "../../components/managerComponent/SidebarManager";
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard";
import { IoIosArrowBack } from "react-icons/io";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useUser } from "../../utils/constant";

function VATSetting() {

    const navigate = useNavigate();
    const [isUseVAT, setIsUseVAT] = useState(false);
    const [vat, setVAT] = useState(0);
    const [vatName, setVATName] = useState('Thuế VAT');
    const [isOpenVerifyRestaurant, setIsOpenVerifyRestaurant] = useState(false);
    const [nameRestaurant, setNameRestaurant] = useState('');
    const [taxCode, setTaxCode] = useState('');
    const [address, setAddress] = useState('');
    const [branch, setBranch] = useState('');
    const [numberRegister, setNumberRegister] = useState('');
    const [restaurantInformation, setRestaurantInformation] = useState('');
    const user = useUser();

    useEffect(() => {
        axiosInstance
        .get(`/api/restaurant/account/${user?.accountId}`)
        .then(res => {
            const data = res.data.result.vat;
            const status = res.data.result.vatActive;
            setRestaurantInformation(data);
            setIsUseVAT(status);
            console.log(res.data.result);
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

    useEffect(() => {
        if(restaurantInformation !== null){
            setAddress(restaurantInformation?.address);
            setBranch(restaurantInformation?.branch);
            setNameRestaurant(restaurantInformation?.name);
            setNumberRegister(restaurantInformation?.registrationNumber);
            setTaxCode(restaurantInformation?.taxCode);
            setVAT(restaurantInformation?.taxValue);
            setVATName(restaurantInformation?.taxName);
        }
    },[restaurantInformation])

    const handleChangeTaxCode = (code) => {
        if(code?.length <= 15){
            setTaxCode(code)
        }
    }

    const handleUpdateVAT = () => {
        if(vatName.trim() === '' || vat === ''){
            toast.warn("Thông tin thuế không dược để trống")
        }else{
            const request = {
                taxName: vatName,
                taxValue: vat
            }
            axiosInstance
            .put(`/api/vat/${restaurantInformation?.id}/tax`,request)
            .then(res => {
                toast.success("Cập nhật dữ liệu thuế thành công")
                navigate('/manager/setting')
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
    }
   
    const handleChangeVAT = (value) => {
        if(!isNaN(value) && value <= 20){
            setVAT(value)
        }
    }

    const handleChangeStatusVAT = (value) => {
        setIsUseVAT(value);
        axiosInstance
        .put(`/api/restaurant/${user?.restaurantId}/vat/${value}`)
        .then(res => {
            value === true ? toast.success('Bật tính năng thuế thành công') : toast.success('Tắt tính năng thuế thành công')
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

    const openVerify = () => {
        setIsOpenVerifyRestaurant(true);
    }

    const closeVerify = () => {
        setIsOpenVerifyRestaurant(false);
    }

    const handleSubmitRestaurantVerify = () => {
        if(nameRestaurant.trim() === '' || taxCode.trim() === '' || address.trim() === ''){
            toast.warn("Thông tin doanh nghiệp không được bỏ trống")
            return 
        }
        const request = {
            name: nameRestaurant,
            taxCode: taxCode,
            address: address,
            branch: branch,
            registrationNumber: numberRegister
        }
        if(restaurantInformation === null){
            axiosInstance
            .post(`/api/vat/restaurant/${user?.restaurantId}/create`,request)
            .then(res => {
                const data = res.data.result;
                setRestaurantInformation(data);
                setIsUseVAT(true);
                toast.success("Tạo thông tin thuế doanh nghiệp thành công!")
                setVAT(data?.taxValue);
                setVATName(data?.taxName);
                closeVerify();
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
        }else{
            axiosInstance
            .put(`/api/vat/${restaurantInformation?.id}`, request)
            .then(res => {
                const data = res.data.result;
                setRestaurantInformation(data);
                toast.success("Cập nhật thông tin thuế doanh nghiệp thành công!")
                closeVerify();
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
        
    }

   
   
    return (
        <div>
            <div className="flex">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarManager />
                </div>
                <div className="basis-[88%] border h-[100vh]">
                    <HeaderManagerDashboard />
                    <div className="min-w-[40]x rounded-lg bg-primary/[0.1] p-16 shadow min-h-[90vh]  mt-2 flex-row ">
    
                        <div className="min-w-[40]x rounded-lg bg-white p-16 shadow min-h-[40vh] mt-2 relative">
                            <div className="absolute top-2 left-2 cursor-pointer flex text-gray-500" onClick={() => navigate("/manager/setting")}><IoIosArrowBack className="size-6"/> <span className="font-medium">Thiết lập nhà hàng</span></div>
                            <h1 className="font-black text-3xl mb-8">Quản lý thuế</h1>

                            <div className="grid gap-4 mb-4 grid-cols-2 w-full">
                                <div className="w-[60%]">
                                    <span className="font-normal w-full">Thiết lập các loại thế phục vụ cho quá trình bán hàng của bạn</span>
                                </div>
                                <div className="w-[100%] bg-gray-300 p-4">
                                    <div className="border-b-2 py-3 w-full flex">
                                        <span className="flex w-full font-semibold text-base">
                                            Sử dụng tính năng thuế
                                        </span>
                                        <div className="w-full flex justify-end"> 
                                                <div className="">
                                                    <label className="inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" checked={isUseVAT} onChange={() =>handleChangeStatusVAT(!isUseVAT)} className="sr-only peer"/>
                                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                    </div>
                                    {isUseVAT && (
                                        <div className="border-b-2 py-4 animate-fadeIn">
                                            <span>Cập nhật thông tin doanh nghiệp <i className="text-blue-700 cursor-pointer font-semibold" onClick={() => openVerify()}>tại đây</i></span>
                                        </div>
                                    )}
                                    {(restaurantInformation !== null && isUseVAT) && (
                                        <div className="py-4">
                                            <div className="grid gap-4 mb-4 grid-cols-1 animate-fadeIn">
                                                <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-1">
                                                    <label htmlFor="username1" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên thuế 
                                                        <span className="text-red-600">{` (*)`}</span>
                                                    </label>
                                                    <input
                                                    type="text"
                                                    name="username1"
                                                    id="username1"
                                                    value={vatName}
                                                    onChange={(e) => setVATName(e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500
                                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="VAT"
                                                    required=""
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <label htmlFor="username2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Giá trị thuế (%)
                                                        <span className="text-red-600">{` (*)`}</span>
                                                    </label>
                                                    <input
                                                    type="text"
                                                    name="username2"
                                                    id="username2"
                                                    value={vat}
                                                    onChange={(e) => handleChangeVAT(e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500
                                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="VAT"
                                                    required=""
                                                    />
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* <form class="p-4 md:p-5"> */}
                            {(restaurantInformation !== null && isUseVAT) && (
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        onClick={() => handleUpdateVAT()}
                                        className="text-white transition ease-in-out duration-300 inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        <GrUpdate className="mr-2" />
                                        Cập nhật
                                    </button>
                                </div>
                            )}
                            {/* </form> */}
                        </div>
                    </div>
                    {isOpenVerifyRestaurant && (
                        <div id="popup-delete" className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                                <div className="relative py-4 w-full max-w-xl bg-white rounded-lg shadow dark:bg-gray-700 animate-slideIn">
                                    <button type="button" onClick={closeVerify} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                    <div className="py-2">
                                        <div className="w-full border-b-2 px-4 flex items-center mb-3">
                                            <h2 className="py-2 font-semibold text-lg">Thông tin doanh nghiệp</h2>
                                        </div>
                                        <div className="grid gap-4 mb-4 grid-cols-2 px-4 border-b-2">
                                            <div className="col-span-2 sm:col-span-1">
                                                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên doanh nghiệp
                                                            <span className="text-red-600">{` (*)`}</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nameRestaurant"
                                                    id="nameRestaurant"
                                                    value={nameRestaurant}
                                                    onChange={(e) => setNameRestaurant(e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500
                                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                                                    placeholder="Tên doanh nghiệp"
                                                    required=""
                                                />
                                            </div>
                                            <div className="col-span-2 sm:col-span-1">
                                                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mã số thuế
                                                            <span className="text-red-600">{` (*)`}</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="taxCode"
                                                    value={taxCode}
                                                    onChange={(e) => handleChangeTaxCode(e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500
                                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                                                    placeholder="Mã số thuế"
                                                    required=""
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Địa chỉ
                                                            <span className="text-red-600">{` (*)`}</span>
                                                </label>
                                                <textarea
                                                    type="text"
                                                    name="address"
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500
                                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                                                    placeholder="Địa chỉ"
                                                    required=""
                                                />
                                            </div>
                                            <div className="col-span-2 sm:col-span-1 mb-6">
                                                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Chi nhánh</label>
                                                <input
                                                    type="text"
                                                    name="branch"
                                                    value={branch}
                                                    onChange={e => setBranch(e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500
                                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                                                    placeholder="Chi nhánh"
                                                    required=""
                                                />
                                            </div>
                                            <div className="col-span-2 sm:col-span-1 mb-6">
                                                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Số đăng ký</label>
                                                <input
                                                    type="text"
                                                    name="numberRegister"
                                                    value={numberRegister}
                                                    onChange={e => setNumberRegister(e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500
                                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                                                    placeholder="Số đăng ký"
                                                    required=""
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full px-4 ">
                                            <div className="flex justify-end">
                                                <div>
                                                    <button
                                                        type="submit"
                                                        onClick={closeVerify}
                                                        className="text-black border-2 transition ease-in-out duration-300 inline-flex items-center bg-white  mr-3 hover:bg-gray-200  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                    >
                                                        Huỷ
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        onClick={() => handleSubmitRestaurantVerify()}
                                                        className="text-white transition ease-in-out duration-300 inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                    >
                                                        <GrUpdate className="mr-2" />
                                                        Lưu thông tin
                                                    </button>
                                                </div>
                                            </div>
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
    )
}

export default VATSetting
