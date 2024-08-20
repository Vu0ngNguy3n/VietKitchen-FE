import { useCallback, useEffect, useState } from "react";
import Dashboardview from "../../components/adminComponent/DashboardView"
import Sidebar from "../../components/adminComponent/Sidebar"
import { FaSearch, FaFileExport, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import _ from "lodash";


function AccountsManagements() {

    const [statusTable, setStatusTable] = useState("enable")
    const [listUsers, setListUsers] = useState([]);
    const [listUsersShow, setListUsersShow] = useState([]);
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalManagers, setTotalManagers] = useState();
    const [isSearch, setIsSearch] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance
        .get("/api/account/manager", {
            params: {
                page: currentPage,
                size: size,
                query: search
            }
        })
        .then(res => {
            const data =res.data.result;
            setListUsers(data.results);
            setListUsersShow(data.results);
            setTotalManagers(data.totalItems)
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
    },[currentPage])

     const handleClick = (page) => {
        if(page > 0 && page <= (totalManagers / 10 + 1)){
            setCurrentPage(page);
        }

    };

    const handleDebouncedChange = useCallback(
        _.debounce((value) => {
            setIsSearch(prev => !prev);
            // setCurrentPage(1)
        }, 500),
        []
    )

    useEffect(() => {
        handleDebouncedChange(search)

        return () => {
            handleDebouncedChange.cancel();
        }
    },[search])

    useEffect(() => {
        setCurrentPage(1);
    },[isSearch])

    

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

                            {/* <div className="flex items-center">
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
                               
                            </div> */}
                        </div>




                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        {/* <th scope="col" className="px-6 py-3">
                                            Tên Người Dùng
                                        </th> */}
                                        <th scope="col" className="px-6 py-3">
                                            Email
                                        </th>
                                        {/* <th scope="col" className="px-6 py-3">
                                            Số điện thoại
                                        </th> */}
                                        <th scope="col" className="px-6 py-3">
                                            Tên nhà hàng
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Gói hiện tại
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <span className="sr-only">Chỉnh sửa</span>
                                        </th>
                                        {/* <th scope="col" className="px-6 py-3">
                                            <span className="sr-only">Vô hiệu hóa</span>
                                        </th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {listUsersShow?.map((user, index) => (
                                        user?.status === true && <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
                                            {/* <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {user?.username}
                                            </th> */}
                                            <td className="px-6 py-4">
                                                {user?.email}
                                            </td>
                                            {/* <td className="px-6 py-4">
                                                {user?.phoneNumber}
                                            </td> */}
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
                                                    Thông tin</button>
                                                {/* <span className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">Chỉnh sửa</span> */}
                                            </td>
                                            {/* <td className="px-6 py-4 flex-row justify-end">
                                                <button
                                                    className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center"
                                                >
                                                    <FaEdit className="mr-1" />
                                                    {user?.isEnable === true ? "Vô hiệu hóa" : "Mở khóa"}
                                                </button>
                                            </td> */}
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
                            <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Hiển thị <span className="font-semibold text-gray-900 dark:text-white">{1 + 10*(currentPage-1)}-{10 + 10*(currentPage-1)}</span> trong <span className="font-semibold text-gray-900 dark:text-white">{totalManagers} </span>khách hàng</span>
                                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                    <li onClick={() => handleClick(currentPage-1)}>
                                        <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Trước</a>
                                    </li>
                                    {Array.from({ length: totalManagers/10+1 }).map((_, index) => (
                                        <li onClick={() => setCurrentPage(index+1)}>
                                            <a href="#" aria-current="page" className={`flex items-center justify-center px-3 h-8 leading-tight ${
                                                currentPage === index+1
                                                    ? 'text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                                                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                                                }`}>{index+1}</a>
                                        </li>
                                    ))}
                                    <li onClick={() => handleClick(currentPage+1)}>
                                         <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Sau</a>
                                    </li>
                                    
                                </ul>
                            </nav>
                        </div>

                    </div>
                </div>


            </div>
        </div>
    )
}

export default AccountsManagements