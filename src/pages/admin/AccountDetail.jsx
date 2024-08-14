import { useEffect, useState } from "react";
import Dashboardview from "../../components/adminComponent/DashboardView"
import Sidebar from "../../components/adminComponent/Sidebar"
import { GrUpdate } from "react-icons/gr";
import { useNavigate, useParams } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { MdOutlineKeyboardBackspace } from "react-icons/md";


function AccountDetail() {

    const navigate = useNavigate();
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [restaurantName, setRestaurantName] = useState('');
    const [province, setProvince] = useState();
    const [months, setMonths] = useState();
    const [packagesList, setPackagesList] = useState();
    const [currentPack, setCurrentPack] = useState('');
    const [restaurantId, setRestaurantId] = useState();
    const {accountId} = useParams();

    useEffect(() => {
        axiosInstance
        .get(`/api/account/${accountId}`)
        .then(res => {
            const data = res.data.result;
            setUsername(data.username);
            setEmail(data.email);
            data.restaurant === null ?setRestaurantName('') : setRestaurantName(data.restaurant.restaurantName)
            data.restaurant === null ?setProvince('') : setProvince(data.restaurant.province)
            data.restaurant === null ?setRestaurantId('') : setRestaurantId(data.restaurant.id)
            data.restaurant === null ? setCurrentPack() : setCurrentPack(data.restaurant.restaurantPackage.id)
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
        .get("/api/package")
        .then(res => {
            setPackagesList(res.data.result)
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


    const handleUpdate = () => {
        const userInformation = {
            packId: currentPack,
            months: months
        }
        axiosInstance
        .put(`/api/restaurant/admin/${restaurantId}`,userInformation)
        .then(res => {
            toast.success(`Nâng cấp lên gói ${currentPack} thành công`)
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
        navigate("/admin/accountsManagement");
    }


    return (
        <div className="">
            <div className="flex  ">
                <div className="basis-[12%] h-[100vh]">
                    <Sidebar />
                </div>
                <div className="basis-[88%] border h-[100vh]">
                    <Dashboardview />
                    <div className="min-w-[40]x rounded-lg bg-white p-16 shadow min-h-[90vh] mt-2">
                        <h1 className="font-black text-3xl">Thông tin người dùng</h1>

                        <div className="p-4 md:p-5">
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên người dùng</label>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        value={username}
                                        disabled={true}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 cursor-not-allowed"
                                        placeholder="Tên người dùng"
                                        required=""
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                    <input
                                        type="text"
                                        name="email"
                                        id="email"
                                        value={email}
                                        disabled={true}
                                        className="bg-gray-50 border cursor-not-allowed border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Email" required="" />
                                </div>
                                
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="restaurant" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên nhà hàng</label>
                                    <input 
                                    type="text" 
                                    name="restaurant"
                                     id="restaurant" 
                                     value={restaurantName}
                                    disabled={true}
                                     className="bg-gray-50 border border-gray-300 cursor-not-allowed text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                     placeholder="Tên nhà hàng" 
                                     required="" />
                                </div>
                                
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="province" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Địa chỉ nhà hàng</label>
                                    <input
                                        type="text"
                                        name="province"
                                        id="province"
                                        value={province}
                                        disabled={true}
                                        className="bg-gray-50 border cursor-not-allowed border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Địa chỉ nhà hàng" required="" />
                                </div>

                                {/* <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Loại gói</label>
                                    <select
                                         id="category"
                                         value={currentPack}
                                         onChange={e => setCurrentPack(e.target.value)}
                                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 
                                          focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400
                                           dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                        <option selected="" value={''}>Chọn gói</option>
                                        {packagesList?.map((pack, index) => (
                                            <option value={pack?.id} key={index}>{pack?.packName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="province" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Số tháng</label>
                                    <input
                                        type="number"
                                        name="province"
                                        id="province"
                                        value={months}
                                        onChange={e => setMonths(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Thời gian gói" required="" />
                                </div> */}
                            </div>
                            <button
                                onClick={() => navigate('/admin/accountsManagement')}
                                className="text-white transition ease-in-out duration-300 inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <MdOutlineKeyboardBackspace  className="mr-2 size-6" />
                                Quay lại
                            </button>
                        </div>
                    </div>

                </div>


            </div>
        </div>
    )
}

export default AccountDetail