import { useState } from "react";
import Dashboardview from "../../components/adminComponent/DashboardView";
import Sidebar from "../../components/adminComponent/Sidebar";
import { FaSearch, FaPlus, FaEdit, FaBan } from "react-icons/fa";
import { useNavigate } from "react-router";

function Packages() {
    const [showPopup, setShowPopup] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);

    const handleAddPackageClick = () => {
        setEditingPackage(null);
        setShowPopup(true);
    };

    const handleEditPackageClick = (pkg) => {
        setEditingPackage(pkg);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const [statusTable, setStatusTable] = useState("enable");
    const navigate = useNavigate();

    const listPackage = [
        {
            packageName: "Gói Thường",
            pricePerMonth: "100.000",
            priceDiscount: "99.000",
            isEnable: true,
        },
        {
            packageName: "Gói Đặc Biệt",
            pricePerMonth: "300.000",
            priceDiscount: "299.000",
            isEnable: true,
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
                        <h1 className="font-black text-3xl">Danh sách gói</h1>

                        <div className="flex mt-6 flex-col gap-4 md:flex-row justify-between">
                            <div className="">
                                <div className="relative grow rounded-md border-2 border-gray-300">
                                    <FaSearch className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 pl-10 outline-none italic "
                                        placeholder="Nhập tên gói"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div>
                                    <button
                                        className="py-2 px-5 bg-lgreen font-semibold text-white rounded hover:bg-green transition-all duration-300 flex items-center"
                                        onClick={handleAddPackageClick}
                                    >
                                        <FaPlus className="mr-1" />
                                        Thêm gói mới
                                    </button>
                                </div>
                            </div>
                        </div>

                        {showPopup && (
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-50">
                                    <button
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
                                        onClick={handleClosePopup}
                                    >
                                        &times;
                                    </button>
                                    <h2 className="text-xl font-semibold mb-4">
                                        {editingPackage ? "Chỉnh sửa gói" : "Thêm mới gói"}
                                    </h2>
                                    <div className="mb-4">
                                        <label className="block mb-2">Tên gói</label>
                                        <input
                                            type="text"
                                            defaultValue={editingPackage ? editingPackage.packageName : ""}
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Giá gói theo tháng</label>
                                        <input
                                            type="text"
                                            defaultValue={editingPackage ? editingPackage.pricePerMonth : ""}
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Giá gói khuyến mãi</label>
                                        <input
                                            type="text"
                                            defaultValue={editingPackage ? editingPackage.priceDiscount : ""}
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-red-700 transition-all duration-300"
                                            onClick={handleClosePopup}
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            className="py-2 px-5 bg-lgreen font-semibold text-white rounded hover:bg-green transition-all duration-300"
                                            onClick={handleClosePopup}
                                        >
                                            {editingPackage ? "Lưu" : "Thêm"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Tên Gói
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Giá Gói(theo tháng)
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Giá khuyến mãi
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
                                    {listPackage.map((pkg, index) => (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {pkg.packageName}
                                            </th>
                                            <td className="px-6 py-4">{pkg.pricePerMonth}</td>
                                            <td className="px-6 py-4">{pkg.priceDiscount}</td>
                                            <td className="px-6 py-4 flex justify-center">
                                                <button
                                                    className="py-2 px-5 bg-secondary font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center"
                                                    onClick={() => handleEditPackageClick(pkg)}
                                                >
                                                    <FaEdit className="mr-1" />
                                                    Chỉnh sửa
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 flex-row justify-end">
                                                <button className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center">
                                                    <FaBan className="mr-1" />
                                                    {pkg.isEnable === true ? "Vô hiệu hóa" : "Mở khóa"}
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

export default Packages;
