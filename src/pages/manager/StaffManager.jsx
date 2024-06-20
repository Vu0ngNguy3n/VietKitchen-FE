import SidebarManager from "../../components/managerComponent/SidebarManager";
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

function StaffManager() {
    const listEmployees = [
        {
            userName: "vietkitchen",
            password: "0869517063",
            employeeName: "Nguyễn Văn",
            email: "kitchenviet@gmail.com",
            phoneNumber: "123456789",
            restaurantid: 1,
            roleId: 2,
        },
        {
            userName: "vietkitchen",
            password: "0869517063",
            employeeName: "Văn Hợp",
            email: "vietchicken@gmail.com",
            phoneNumber: "987654321",
            restaurantid: 2,
            roleId: 3,
        },
        {
            userName: "vietkitchen",
            password: "0869517063",
            employeeName: "Hợp Nguyễn",
            email: "chickenkitchen@gmail.com",
            phoneNumber: "192837465",
            restaurantid: 3,
            roleId: 1,
        },
    ];

    return (
        <div className="">
            <div className="flex ">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarManager />
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <HeaderManagerDashboard />
                    <div className="min-w-[40]x rounded-lg bg-white p-16 shadow min-h-[90vh] mt-2">
                        <h1 className="font-black text-3xl">Quản lý nhân viên</h1>

                        <div className="flex mt-6 flex-col gap-4 md:flex-row justify-between">
                            <div className="">
                                <div className="relative grow rounded-md border-2 border-gray-300">
                                    <FaSearch className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 pl-10 outline-none italic "
                                        placeholder="Nhập tên nhân viên"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div>
                                    <button className="py-2 px-5 bg-lgreen font-semibold text-white rounded hover:bg-green transition-all duration-300 flex items-center">
                                        <FaPlus className="mr-1" />
                                        Thêm nhân viên
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Tên Nhân Viên
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Số Điện Thoại
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Vai trò
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <span className="sr-only">Chỉnh sửa</span>
                                            <span className="sr-only">Xóa</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listEmployees.map((e, index) => (
                                        <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {e.employeeName}
                                            </th>
                                            <td className="px-6 py-4">
                                                {e.phoneNumber}
                                            </td>
                                            <td className="px-6 py-4">
                                                {e.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {e.roleId}
                                            </td>
                                            <td className="px-6 py-4 flex space-x-2">
                                                <button className="py-2 px-5 bg-secondary font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center">
                                                    <FaEdit className="mr-1" />
                                                    Chỉnh sửa
                                                </button>
                                                <button className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center">
                                                    <FaTrash className="mr-1" />
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default StaffManager;
