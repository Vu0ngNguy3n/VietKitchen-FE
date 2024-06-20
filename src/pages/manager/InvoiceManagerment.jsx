import { useState } from 'react';
import SidebarManager from "../../components/managerComponent/SidebarManager";
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard";
import { FaEdit, FaTrash, FaClock } from "react-icons/fa";

function InvoiceManagement() {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const listBills = [
        {
            billCode: "abc123",
            total: "1.000.000",
            orderId: "1",
            dateCreate: "20/01/2024 19:05",
            methodPayment: "chuyển khoản",
        },
        {
            billCode: "cdm113",
            total: "1.500.000",
            orderId: "2",
            dateCreate: "20/01/2024 19:05",
            methodPayment: "tiền mặt",
        },
        {
            billCode: "ddd101",
            total: "600.000",
            orderId: "3",
            dateCreate: "20/01/2024 19:05",
            methodPayment: "chuyển khoản",
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
                        <h1 className="font-black text-3xl">Quản lý hóa đơn</h1>

                        <div className="flex mt-6 flex-col gap-4 md:flex-row justify-between">
                            <div className="flex items-center">
                                <form className="max-w-sm mr-4 relative">
                                    <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                                    <select
                                        id="filter"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                focus:border-blue-500 block w-full p-2 pl-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none cursor-pointer"
                                    >
                                        <option selected>Hôm nay</option>
                                        <option value="7ago">7 ngày trước</option>
                                        <option value="yesterday">hôm qua</option>
                                        <option value="lmonth">Tháng trước</option>
                                    </select>
                                </form>
                            </div>
                        </div>

                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Mã Hóa Đơn
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Thành Tiền
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Phương Thức Thanh Toán
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Thời Gian Thanh Toán
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <span className="sr-only">Xóa</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listBills.map((b, index) => (
                                        <tr key={index} className={`odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700`}>
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {b.billCode}
                                            </th>
                                            <td className="px-6 py-4">
                                                {b.total}
                                            </td>
                                            <td className="px-6 py-4">
                                                {b.methodPayment}
                                            </td>
                                            <td className="px-6 py-4">
                                                {b.dateCreate}
                                            </td>
                                            <td className="px-6 py-4 flex space-x-2">
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
    );
}

export default InvoiceManagement;
