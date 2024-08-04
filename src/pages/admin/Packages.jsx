import { useEffect, useState } from "react";
import Dashboardview from "../../components/adminComponent/DashboardView";
import Sidebar from "../../components/adminComponent/Sidebar";
import { FaSearch, FaPlus, FaEdit, FaBan } from "react-icons/fa";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { formatVND } from "../../utils/format";

function Packages() {

    const [statusTable, setStatusTable] = useState("enable");
    const [listPackage, setListPackage] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance
        .get("/api/package")
        .then(res => {
            setListPackage(res.data.result)
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

    const handleAddPackageClick = () => {
        navigate('/admin/packageDetail')
    };

    const handleEditPackageClick = (pkg) => {
        navigate(`/admin/packageUpdate/${pkg?.id}`)
    };


   

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


                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Tên Gói
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Giá Theo Tháng
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Giá Theo Năm
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
                                    {listPackage?.map((pkg, index) => (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {pkg?.packName}
                                            </th>
                                            <td className="px-6 py-4">{formatVND(pkg?.pricePerMonth)}</td>
                                            <td className="px-6 py-4">{formatVND(pkg?.pricePerYear)}</td>
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
