import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { GrUpdate } from "react-icons/gr";
import { useNavigate } from "react-router";
import provinces from '../../utils/provinces.json'
import SidebarManager from "../../components/managerComponent/SidebarManager";
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard";
import { Select } from "../../components/managerComponent/Select";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import {  useUser } from "../../utils/constant";
import { IoIosArrowBack } from "react-icons/io";
import { SelectBank } from "../../components/managerComponent/SelectBank";
import _ from "lodash";

function PaymentSetting() {

    const navigate = useNavigate();
    const [binBank, setBinBank] = useState();
    const user = useUser();
    const [listBank, setListBank] = useState([]);
    const [currentBank, setCurrentBank] = useState('');
    const [customerBankName, setCustomerBankName] = useState('');
    const [customerBankNumber, setCustomerBankNumber] = useState('');
    const [restaurantData, setRestaurantData] = useState();

    useEffect(() => {
        axios
        .get('https://api.vietqr.io/v2/banks')
        .then(res => {
            const data = res.data.data;
            setListBank(data);
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

        axiosInstance
        .get(`/api/restaurant/account/${user?.accountId}`)
        .then(res => {
            const data = res.data.result; 
            console.log(res.data.result);
            setCustomerBankName(data?.account_NAME);
            setCustomerBankNumber(data?.account_NO);
            setBinBank(data?.bank_ID)
            setRestaurantData(res.data.result);
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

    useEffect(() => {
        const currentBankName = listBank?.find(b => b?.bin === binBank);
        setCurrentBank(currentBankName?.name);
    },[binBank])

    const handleDebouncedChange = useCallback(
        _.debounce((value) => {
            var data = JSON.stringify({
                bin: binBank,
                accountNumber: customerBankNumber
            });

            var config = {
                method: 'post',
                url: 'https://api.vietqr.io/v2/lookup',
                headers: { 
                    'x-client-id': '752aa61c-e3c9-4b9c-8828-ff2711468e66', 
                    'x-api-key': '630e1ee3-7cf6-4279-9b11-16eae4b8c4e7', 
                    'Content-Type': 'application/json',
                },
                data : data
            };

            // axios(config)
            // .then(function (response) {
            //     setCustomerBankName(response.data.data.accountName)
            // })
            // .catch(function (error) {
            //     console.log(error);
            // });

        }, 500),
        []
    )

    useEffect(() => {
        handleDebouncedChange(customerBankNumber)

        return () => {
            handleDebouncedChange.cancel();
        }
    },[customerBankNumber, handleDebouncedChange])



    const handleUpdateBank = () => {
        if(customerBankName.trim() === '' || customerBankNumber.trim() === '' || !binBank){
            toast.warn("Thông tin thanh toán không được để trống!")
            return
        }
        const data = {
            account_NO: customerBankNumber,
            account_NAME: customerBankName,
            bank_ID: binBank?.bin
        }
        
        axiosInstance
        .put(`/api/restaurant/manager/payment/${user?.accountId}`, data)
        .then(res => {
            toast.success("Cập nhật thông tin ngân hàng thành công")
            navigate("/manager/setting")
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
                            <div className="absolute top-2 left-2 cursor-pointer text-gray-500 flex" onClick={() => navigate("/manager/setting")}><IoIosArrowBack className="size-6"/>  <span className="font-medium">Thiết lập nhà hàng</span></div>
                            <h1 className="font-black text-3xl mb-8">Thiết lập thanh toán</h1>

                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className=" col-span-2 ">
                                    <label htmlFor="provinces" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ngân hàng</label>
                                    {/* <select
                                        id="provinces"
                                        value={provinceResult}
                                        onChange={(e) => setProvinceResult(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ">
                                        <option value="">Tỉnh thành</option>
                                        {provinces?.map((province, index) => (
                                            <option value={province?.name} key={index}>{province?.name}</option>
                                        ))}
                                    </select> */}
                                    <SelectBank
                                        value={currentBank}
                                        onChange={setCurrentBank} 
                                        onChangeBin={setBinBank}
                                        valueBin={binBank}
                                        options={listBank}
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Số tài khoản ngân hàng</label>
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        value={customerBankNumber}
                                        onChange={e => setCustomerBankNumber(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                        focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500
                                         dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                                        placeholder="Số tài khoản ngân hàng"
                                        required=""
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1 ">
                                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên tài khoản ngân hàng</label>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        value={customerBankName}
                                        onChange={e => setCustomerBankName(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                        focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500
                                         dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                                        placeholder="Tên tài khoản ngân hàng"
                                        required=""
                                    />
                                </div>
                                
                                

                            </div>
                            <button
                                type="submit"
                                onClick={() => handleUpdateBank()}
                                className="text-white transition ease-in-out duration-300 inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <GrUpdate className="mr-2" />
                                    Cập nhật
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentSetting
