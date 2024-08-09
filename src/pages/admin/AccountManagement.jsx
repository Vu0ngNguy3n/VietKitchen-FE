import { useEffect, useState } from "react";
import Dashboardview from "../../components/adminComponent/DashboardView"
import Sidebar from "../../components/adminComponent/Sidebar"
import { FaSearch, FaFileExport, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";


function AccountsManagements() {

    const [statusTable, setStatusTable] = useState("enable")
    const [listUsers, setListUsers] = useState([]);
    const [listUsersShow, setListUsersShow] = useState([]);
    const [search, setSearch] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance
        .get("/api/account/manager")
        .then(res => {
            setListUsers(res.data.result);
            setListUsersShow(res.data.result);
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
        const newList = listUsers?.filter(user => (user?.username.toLowerCase().includes(search.toLowerCase()) || user?.email.toLowerCase().includes(search.toLowerCase())))
        setListUsersShow(newList)
    },[search])


    return (
        <div className="">
            <div className="flex">
                <div className="basis-[12%] h-[100vh]">
                    <Sidebar />
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <Dashboardview />
                    <div className="min-w-[40]x rounded-lg bg-white p-16 shadow min-h-[90vh] mt-2">
                        <h1 className="font-black text-3xl">Danh sách người dùng</h1>

                        <div className="flex mt-6 flex-col gap-4 md:flex-row justify-between">
                            <div className="">
                                <div className="relative grow rounded-md border-2 border-gray-300">
                                    <FaSearch
                                        className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        className=" w-full px-4 py-3 pl-10 outline-none italic "
                                        placeholder="Nhập tên/email cửa hàng"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                </div>


                            </div>

                            <div className="flex items-center">
                                <form className="max-w-sm mr-4 ">
                                    <select
                                        id="countries"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                        focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                        outline-none px-4 py-3 cursor-pointer">
                                        <option selected>Tài khoản không bị khóa</option>
                                        <option value="US">Tài khoản bị khóa</option>
                                    </select>
                                </form>
                                {/* <div>
                                    <button className="py-2 px-5 bg-secondary font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center"> <FaFileExport className="mr-1" />
                                        Xuất Excel</button>
                                </div> */}
                            </div>
                        </div>




                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Tên Người Dùng
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Tên nhà hàng
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Gói hiện tại
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <span className="sr-only">Chỉnh sửa</span>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <span className="sr-only">Vô hiệu hóa</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listUsersShow?.map((user, index) => (
                                        user?.status === true && <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {user?.username}
                                            </th>
                                            <td className="px-6 py-4">
                                                {user?.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user?.restaurant === null ? '' : user?.restaurant?.restaurantName}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user?.restaurant === null ? '' : user?.restaurant?.restaurantPackage?.packName}
                                            </td>
                                            <td className="px-6 py-4 flex justify-center">
                                                <button
                                                    className="py-2 px-5 bg-secondary font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center"
                                                    onClick={() => navigate(`/admin/accountDetail/${user?.id}`)}
                                                >
                                                    <FaEdit className="mr-1" />
                                                    Chỉnh sửa</button>
                                                {/* <span className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">Chỉnh sửa</span> */}
                                            </td>
                                            <td className="px-6 py-4 flex-row justify-end">
                                                <button
                                                    className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center"
                                                >
                                                    <FaEdit className="mr-1" />
                                                    {user?.isEnable === true ? "Vô hiệu hóa" : "Mở khóa"}
                                                </button>
                                                {/* <span className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer">{user.isEnable === true ? "Vô hiệu hóa" : "Mở khóa"}</span> */}
                                            </td>
                                        </tr>
                                    ))}

                                    {listUsersShow?.length === 0 ?<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <th scope="row" className="px-6 py-4 font-medium text-red-900 whitespace-nowrap dark:text-white">
                                                Không tìm thấy người dùng
                                            </th>
                                            <td className="px-6 py-4">
                                            </td>
                                            <td className="px-6 py-4">
                                            </td>
                                            <td className="px-6 py-4">
                                            </td>
                                            <td className="px-6 py-4 flex justify-center">
                                                
                                                {/* <span className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">Chỉnh sửa</span> */}
                                            </td>
                                            <td className="px-6 py-4 flex-row justify-end">
                                               
                                                {/* <span className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer">{user.isEnable === true ? "Vô hiệu hóa" : "Mở khóa"}</span> */}
                                            </td>
                                        </tr>:''}

                                </tbody>
                            </table>
                            
                        </div>

                    </div>
                </div>


            </div>
        </div>
    )
}

export default AccountsManagements