import SidebarManager from "../../components/managerComponent/SidebarManager"
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard"
import { IoMdAdd } from "react-icons/io";
import { FaEdit, FaBan } from "react-icons/fa";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router";
import { getUser } from "../../utils/constant";

function UnitManagement() {

    const [openPop, setOpenPop] = useState(false);
    const [isAddUnit, setIsAddUnit] = useState(false);
    const [unitName, setUnitName] = useState('');
    const [unitsList, setUnitsList] = useState([]);
    const [accountStorage, setAccountStorage] = useState();
    const [isCreate, setIsCreate] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [unitId, setUnitId] = useState();

    const navigate = useNavigate();

    useEffect(() =>{

        const account = getUser();
        setAccountStorage(account)

        axiosInstance
        .get(`/api/unit/account/${account.accountId}`)
        .then(res => {
            const data = res.data.result;
            setUnitsList(data);
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
    },[isAddUnit])

    const handleOpenPopup = () => {
        setIsCreate(true);
        setIsEdit(false);
        setOpenPop(true);
    }

    const handleClosePopup = () => {
        setOpenPop(false);
        setUnitName('');
    }

    const handleCreateUnit = () => {
        if(unitName.trim() === ''){
            toast.warn("Vui lòng điền tên đơn vị")
        }else{
             const newUnit = {
                name: unitName,
                accountId: accountStorage?.accountId
            }

            if(isCreate){
                
                axiosInstance
                .post('/api/unit/create', newUnit)
                .then(res => {
                    toast.success(`Tạo đơn vị ${unitName} thành công!`)
                    setUnitName('');
                    setIsAddUnit(!isAddUnit)
                    setOpenPop(false);
                    setUnitName('');
                    // navigate('/manager/setting')
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
            }else if(isEdit){
                axiosInstance
                .put(`/api/unit/${unitId}`, newUnit)
                .then(res => {
                    toast.success(`Cập nhật đơn vị ${unitName} thành công!`)
                    setUnitName('');
                    setIsAddUnit(!isAddUnit)
                    setOpenPop(false);
                    setUnitName('');
                    // navigate('/manager/setting')
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
    }

    const handleOpenEditUnit = (unit) => {
        setOpenPop(true);
        setUnitId(unit?.id);
        setUnitName(unit?.name)
        setIsEdit(true);
        setIsCreate(false);
    }

    return (
        <div className="">
            <div className="flex ">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarManager />
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <HeaderManagerDashboard />
                    <div className="min-w-[40]x rounded-lg bg-white p-16 shadow min-h-[90vh] mt-2">
                    <div className="flex justify-between">
                            <h1 className="font-black text-3xl">Quản lý đơn vị tính</h1>
                            <button 
                                className="py-2 px-3 bg-secondary font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center" 
                                onClick={handleOpenPopup}
                            >
                                <IoMdAdd />Thêm đơn vị tính</button>
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
                                        Thêm đơn vị tính
                                    </h2>
                                    <div className="mb-4">
                                        <label className="block mb-2">Tên đơn vị tính</label>
                                        <input
                                            type="text"
                                            placeholder="Tên đơn vị tính"
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={unitName}
                                            onChange={(e) => setUnitName(e.target.value)}
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
                                            onClick={handleCreateUnit}
                                        >
                                            {isCreate ? 'Thêm':'Cập nhật'}
                                        </button>
                                    </div>
                                </div>
                            </div>:""}

                        <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
                            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                       
                                        <th scope="col" class="px-6 py-3">
                                            Tên đơn vị
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unitsList?.map((unit, index) => (
                                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
                                        
                                            <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                                {unit?.name}
                                            </td>
                                            
                                            <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white flex justify-center">
                                            <button
                                                onClick={() => handleOpenEditUnit(unit)}
                                                className="py-2 px-5 bg-secondary font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center"
                                                    >
                                                        <FaEdit className="mr-1" />
                                                        Chỉnh sửa
                                                    </button>
                                            </td>
                                            <td class="px-6 py-4 ">
                                            <button className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center">
                                                        <FaBan className="mr-1" />
                                                        Xoá
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

export default UnitManagement
