import { useState } from "react";
import Dashboardview from "../../components/adminComponent/DashboardView"
import Sidebar from "../../components/adminComponent/Sidebar"
import { GrUpdate } from "react-icons/gr";
import { useNavigate } from "react-router";


function AccountDetail() {

    const navigate = useNavigate();
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [restaurant, setRestaurant] = useState();
    const [packageName, setPackageName] = useState();
    const [status, setStatus] = useState();
    

    const handleUpdate = () => {
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

                        <form class="p-4 md:p-5">
                            <div class="grid gap-4 mb-4 grid-cols-2">
                                <div class="col-span-2 ">
                                    <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên người dùng</label>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        value={username}
                                        disabled={true}
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 cursor-not-allowed"
                                        placeholder="Tên người dùng"
                                        required=""
                                    />
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                    <input
                                        type="text"
                                        name="email"
                                        id="email"
                                        value={email}
                                        disabled={true}
                                        class="bg-gray-50 border cursor-not-allowed border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Email" required="" />
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="restaurant" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên nhà hàng</label>
                                    <input 
                                    type="number" 
                                    value={restaurant} 
                                    name="restaurant"
                                     id="restaurant" 
                                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                     placeholder="Tên nhà hàng" required="" />
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Loại gói</label>
                                    <select id="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                        <option selected="">Chọn gói</option>
                                        <option value="trial">Trial</option>
                                        <option value="standard">Standard</option>
                                        <option value="premium">Premium</option>
                                    </select>
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Trạng thái</label>
                                    <input
                                        type="text"
                                        name="status"
                                        id="status"
                                        value={status}
                                        disabled={true}
                                        class="bg-gray-50 border cursor-not-allowed border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Trạng thái" required="" />
                                </div>
                            </div>
                            <button
                                type="submit"
                                onClick={() => handleUpdate()}
                                class="text-white transition ease-in-out duration-300 inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <GrUpdate className="mr-2" />
                                Cập nhật
                            </button>
                        </form>
                    </div>

                </div>


            </div>
        </div>
    )
}

export default AccountDetail