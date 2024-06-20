import SidebarManager from "../../components/managerComponent/SidebarManager";
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useState } from "react";

function CustomerManager() {
    const [statusTable, setStatusTable] = useState("enable");
    const [selectAll, setSelectAll] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const navigate = useNavigate();

    const listCustomers = [
        {
            name: "Văn Hợp",
            phoneNumber: "0869517063",
            adress: "Quảng Ninh, Quảng Yên",
            point: "500",
            restaurantid: 1,
        },
        {
            name: "Hợp Nguyễn",
            phoneNumber: "0869517063",
            adress: "Quảng Ninh, Quảng Yên",
            point: "500",
            restaurantid: 2,
        },
        {
            name: "Nguyễn Hợp",
            phoneNumber: "0869517063",
            adress: "Quảng Ninh, Quảng Yên",
            point: "500",
            restaurantid: 3,
        },
    ];

    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        setSelectAll(isChecked);
        setSelectedCustomers(isChecked ? listCustomers.map((_, index) => index) : []);
    };

    const handleSelectCustomer = (e, index) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setSelectedCustomers([...selectedCustomers, index]);
        } else {
            setSelectedCustomers(selectedCustomers.filter((i) => i !== index));
        }
    };

    return (
        <div className="">
            <div className="flex ">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarManager />
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <HeaderManagerDashboard />
                    <div className="min-w-[40]x rounded-lg bg-white p-16 shadow min-h-[90vh] mt-2">
                        <h1 className="font-black text-3xl">Quản lý khách hàng</h1>

                        <div className="flex mt-6 flex-col gap-4 md:flex-row justify-between">
                            <div className="">
                                <div className="relative grow rounded-md border-2 border-gray-300">
                                    <FaSearch className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 pl-10 outline-none italic "
                                        placeholder="Nhập tên khách hàng"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div>
                                    <button className="py-2 px-5 bg-lgreen font-semibold text-white rounded hover:bg-green transition-all duration-300 flex items-center">
                                        <FaPlus className="mr-1" />
                                        Thêm khách hàng
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="p-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="checkbox-all-search"
                                                    type="checkbox"
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    checked={selectAll}
                                                    onChange={handleSelectAll}
                                                />
                                                <label htmlFor="checkbox-all-search" className="sr-only">
                                                    checkbox
                                                </label>
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Tên Khách Hàng
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Số Điện Thoại
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Địa chỉ
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Điểm
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <span className="sr-only">Chỉnh sửa</span>
                                            <span className="sr-only">Xóa</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listCustomers.map((c, index) => (
                                        <tr
                                            key={index}
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                        >
                                            <td className="w-4 p-4">
                                                <div className="flex items-center">
                                                    <input
                                                        id={`checkbox-table-search-${index}`}
                                                        type="checkbox"
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                        checked={selectedCustomers.includes(index)}
                                                        onChange={(e) => handleSelectCustomer(e, index)}
                                                    />
                                                    <label htmlFor={`checkbox-table-search-${index}`} className="sr-only">
                                                        checkbox
                                                    </label>
                                                </div>
                                            </td>
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {c.name}
                                            </th>
                                            <td className="px-6 py-4">{c.phoneNumber}</td>
                                            <td className="px-6 py-4">{c.adress}</td>
                                            <td className="px-6 py-4">{c.point}</td>
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
    );
}

export default CustomerManager;
