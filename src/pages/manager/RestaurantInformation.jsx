import axios from "axios";
import { useEffect, useState } from "react";
import { GrUpdate } from "react-icons/gr";
import { useNavigate } from "react-router";
import provinces from '../../utils/provinces.json'
import SidebarManager from "../../components/managerComponent/SidebarManager";
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard";
import { Select } from "../../components/managerComponent/Select";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

function RestaurantInformation() {

    const navigate = useNavigate();
    const [username, setUsername] = useState();
    const [provinceResult, setProvinceResult] = useState('');
    const [accountStorage, setAccountStorage] = useState();
    const [restaurantInformation, setRestaurantInformation] = useState('');
    const [address, setAddress] = useState('')

    function handleUpdate() {
      
        if(username.trim() === '' || address.trim() === '' || provinceResult === ''){
            toast.warn("Vui lòng điền đầy đủ thông tin cửa hàng")
        }else{
            

            if(restaurantInformation === null) {
                const restaurantCreate = {
                    restaurantName: username,
                    accountId: accountStorage?.accountId,
                    address: address,
                    province: provinceResult,
                    district: provinceResult
                }
                axiosInstance
                    .post("/api/restaurant/init", restaurantCreate)
                    .then(res => {
                        toast.success("Tạo thông tin cửa hàng thành công!")
                        navigate("/manager/dashboard")
                        localStorage.setItem("token", res.data.result.token);
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
            }else{
                const restaurantCreate = {
                    restaurantName: username,
                    address: address,
                    province: provinceResult,
                    district: provinceResult
                }
                
                 axiosInstance
                    .put(`/api/restaurant/manager/${accountStorage?.accountId}`, restaurantCreate)
                    .then(res => {
                        toast.success("Cập nhật thông tin cửa hàng thành công!")
                        // navigate("/manager/dashboard")
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
        }
        
    }

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null
        setAccountStorage(user);
        axiosInstance
        .get(`/api/restaurant/account/${user.accountId}`)
        .then(res => {
            const data =res.data.result;
            setRestaurantInformation(data);
            data === null ? setUsername('') : setUsername(data.restaurantName)
            data === null ? setProvinceResult('') : setProvinceResult(data.province)
            data === null ? setAddress('') : setAddress(data.address)
            
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


    return (
        <div>
            <div className="flex">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarManager />
                </div>
                <div className="basis-[88%] border h-[100vh]">
                    <HeaderManagerDashboard />
                    <div className="min-w-[40]x rounded-lg bg-primary/[0.1] p-16 shadow min-h-[90vh]  mt-2 flex-row ">

                        <div className="min-w-[40]x rounded-lg bg-white p-16 shadow min-h-[40vh] mt-2 ">
                            <h1 className="font-black text-3xl mb-8">Thông tin nhà hàng</h1>

                            {/* <form class="p-4 md:p-5"> */}
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="col-span-2 ">
                                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên cửa hàng của bạn</label>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                        focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500
                                         dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                                        placeholder="Tên cửa hàng"
                                        required=""
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Địa chỉ</label>
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                        focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500
                                         dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                                        placeholder="Địa chỉ"
                                        required=""
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="provinces" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tỉnh thành</label>
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
                                    <Select
                                        value={provinceResult}
                                        onChange={setProvinceResult} 
                                        options={provinces}
                                    />
                                </div>

                            </div>
                            <button
                                type="submit"
                                onClick={() => handleUpdate()}
                                className="text-white transition ease-in-out duration-300 inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <GrUpdate className="mr-2" />
                                {restaurantInformation === null ? 'Tạo Cửa Hàng' : "Cập nhật"}
                            </button>
                            {/* </form> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantInformation
