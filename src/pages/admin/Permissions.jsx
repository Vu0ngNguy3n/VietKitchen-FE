import Dashboardview from "../../components/adminComponent/DashboardView";
import Sidebar from "../../components/adminComponent/Sidebar";
import { FaSearch, FaEdit, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { debounce } from "lodash";

function Permissions() {
    const [permissionSearch, setPermissionSearch] = useState('');
    const [openPop, setOpenPop] = useState(false)
    const [isEdit, setIsEdit] = useState(false);
    const [isCreate, setIsCreate] = useState(true)
    const [permissionName, setPermissionName] = useState('');
    const [permissionDescription, setPermissionDescription] = useState('');
    const [permissionList, setPermissionList] = useState();
    const [isUpdate, setIsUpdate] = useState(false);
    const [currentPermissionId, setCurrentPermissionId] = useState('');
    const [permissionShow, setPermissionShow] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance
        .get("/api/permission")
        .then(res => {
            setPermissionList(res.data.result)
            setPermissionShow(res.data.result)
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
    },[isUpdate])
    

    const handleClosePopup = () => {
        setOpenPop(false);
        setPermissionName('');
        setPermissionDescription('');
    }

    const handleOpenPopup = () => {
        setOpenPop(true);
        setIsCreate(true);
        setIsEdit(false);
    }

    const handleCreatePermission =async () => {
        if(permissionName.trim() === '' ){
            toast.warn("Tên chức năng không được để trống")
        }else if(permissionDescription.trim() === ''){
            toast.warn("Miêu tả chức năng không được để trống")
        }else if(isCreate){
            const newPermission = {
                name: permissionName,
                description: permissionDescription
            }
            axiosInstance
            .post("/api/permission/create", newPermission)
            .then(res => {
                toast.success("Tạo chức năng mới thành công");
                handleClosePopup();
                setIsUpdate(!isUpdate);
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
            });
        }else{
            const newPermission = {
                name: permissionName,
                description: permissionDescription
            }
            
            axiosInstance
            .put(`/api/permission/${currentPermissionId}`,newPermission)
            .then(res => {
                toast.success(`Cập nhật chức năng ${permissionName} thành công`)
                console.log(res.data.result);
                handleClosePopup()
                setIsUpdate(!isUpdate)
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
        }
    }

    const handleOpenEditPermission = (permiss) => {
        setOpenPop(true)
        setPermissionName(permiss?.name)
        setPermissionDescription(permiss?.description)
        setCurrentPermissionId(permiss?.id)
        setIsCreate(false);
        setIsEdit(true);
    }

    const performSearch = useCallback(
        debounce((searchTerm) => {
            const resultPermissions = permissionList?.filter(p => p?.name.toUpperCase().includes(searchTerm.toUpperCase()) || p?.description.toUpperCase().includes(searchTerm.toUpperCase()));
            setPermissionShow(resultPermissions)
        },300),
        []
    )

    const handleInputChange = (e) => {
        const { value } = e.target;
        setPermissionSearch(value);
        performSearch(value);
    };



    return (
        <div className="">
            <div className="flex">
                <div className="basis-[12%] h-[100vh]">
                    <Sidebar />
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <Dashboardview />
                    <div className="min-w-[40]x rounded-lg bg-white p-16 shadow min-h-[90vh] ">
                        <h1 className="font-black text-3xl">Danh sách chức năng</h1>

                        <div className="flex mt-4 flex-col gap-4 md:flex-row justify-between">
                            <div className="">
                                <div className="relative grow rounded-md border-2 border-gray-300">
                                    <FaSearch className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 pl-10 outline-none italic "
                                            placeholder="Nhập tên chức năng"
                                            value={permissionSearch}
                                            onChange={handleInputChange}
                                        />
                                </div>
                                
                            </div>
                             <div className="flex items-center">
                                <div>
                                    <button
                                        className="py-2 px-5 bg-lgreen font-semibold text-white rounded hover:bg-green transition-all duration-300 flex items-center"
                                        onClick={handleOpenPopup}
                                    >
                                        <FaPlus className="mr-1" />
                                        Thêm chức năng
                                    </button>
                                </div>
                            </div>
                        </div>

                        {openPop?<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-50">
                                    <button
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
                                        onClick={handleClosePopup}
                                    >
                                        &times;
                                    </button>
                                    <h2 className="text-xl font-semibold mb-4">
                                        Thêm chức năng
                                    </h2>
                                    <div className="mb-4">
                                        <label className="block mb-2">Tên chức năng</label>
                                        <input
                                            type="text"
                                            placeholder="Tên chức năng"
                                            className={`w-full px-3 py-2 border rounded-md ${!isCreate&&"cursor-not-allowed"}`}
                                            disabled={isCreate ? false : true}
                                            value={permissionName}
                                            onChange={(e) => setPermissionName(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Miêu tả</label>
                                        <textarea
                                            type="text"
                                            placeholder="Miêu tả"
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={permissionDescription}
                                            onChange={(e) => setPermissionDescription(e.target.value)}
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
                                            onClick={handleCreatePermission}
                                        >
                                            Lưu
                                        </button>
                                    </div>
                                </div>
                            </div>:""}

                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-8">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            STT
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Tên Chức Năng
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
                                    {permissionShow?.map((permiss, index) => (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4">{permiss?.name}</td>
                                            <td className="px-6 py-4">{permiss?.description}</td>
                                            <td className="px-6 py-4 ">
                                                <button
                                                    onClick={() => handleOpenEditPermission(permiss)}
                                                    className="py-2 px-5 bg-secondary font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center"
                                                >
                                                    <FaEdit className="mr-1" />
                                                    Chỉnh sửa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {permissionShow?.length === 0 && (
                                        <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                            <td className="px-6 py-4 text-red-500">
                                                Không tìm thấy chức năng tương ứng
                                            </td>
                                        </tr>
                                    )}
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
