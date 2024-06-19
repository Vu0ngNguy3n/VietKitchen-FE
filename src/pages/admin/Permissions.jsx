import Dashboardview from "../../components/adminComponent/DashboardView";
import Sidebar from "../../components/adminComponent/Sidebar";
import { FaSearch, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useState } from "react";

function Permissions() {
    const [statusTable, setStatusTable] = useState("enable");
    const navigate = useNavigate();

    const listPermission = [
        {
            name: "Admin",
            description: "Tao là to nhất",
        },
        {
            name: "Chủ nhà hàng",
            description: "Tao là chủ nhà hàng",
        },
        {
            name: "Quản lý nhà hàng",
            description: "Thằng chủ nó thuê tao về quản lý",
        },
        {
            name: "Nhân viên",
            description: "Thấp cổ bé họng",
        },
    ];

    return (
        <div className="">
            <div className="flex">
                <div className="basis-[12%] h-[100vh]">
                    <Sidebar />
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <Dashboardview />
                    <div className="min-w-[40]x rounded-lg bg-white p-16 shadow min-h-[90vh] mt-2">
                        <h1 className="font-black text-3xl">Danh sách quyền</h1>

                        <div className="flex mt-6 flex-col gap-4 md:flex-row justify-between">
                            <div className="">
                                <div className="relative grow rounded-md border-2 border-gray-300">
                                    <FaSearch className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 pl-10 outline-none italic "
                                        placeholder="Nhập tên quyền"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            STT
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Tên Quyền
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Mô Tả
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <span className="sr-only">Chỉnh sửa</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listPermission.map((permiss, index) => (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4">{permiss.name}</td>
                                            <td className="px-6 py-4">{permiss.description}</td>
                                            <td className="px-6 py-4 flex justify-center">
                                                <button
                                                    className="py-2 px-5 bg-secondary font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center"
                                                >
                                                    <FaEdit className="mr-1" />
                                                    Chỉnh sửa
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
    );
}

export default Permissions;
