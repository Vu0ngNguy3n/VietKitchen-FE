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
    const [isOpenDeletePop, setIsOpenDeletePop] = useState(false);
    const [unitDeleteName, setUnitDeleteName] = useState();

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

    const handleOpenDeletePop = (unit) => {
        setIsOpenDeletePop(true);
        setOpenPop(false);
        setUnitDeleteName(unit?.name)
        setUnitId(unit.id);
        
    }

    const handleCloseDeletePop = () => {
        setIsOpenDeletePop(false);
        setOpenPop(false);
        setUnitId('');
        setUnitName("");
    }

    const handleSubmitDeleteUnit = () => {
        axiosInstance
        .delete(`/api/unit/${unitId}`)
        .then(res =>{
            setIsAddUnit(!isAddUnit)
            toast.success(`Xoá ${unitDeleteName} thành công!`)
            setUnitDeleteName('');
            setUnitId();
            handleCloseDeletePop();
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
                        {openPop ? (
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-50 animate-slideIn">
                                    <button
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
                                        onClick={handleClosePopup}
                                    >
                                        &times;
                                    </button>
                                    <h2 className="text-xl font-semibold mb-4">
                                        {isCreate ? 'Thêm đơn vị tính' : 'Cập nhật đơn vị tính'}
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
                                            {isCreate ? 'Thêm' : 'Cập nhật'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {isOpenDeletePop ? (
                            <div id="popup-delete" className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                                <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700 animate-slideIn">
                                    <button type="button" onClick={handleCloseDeletePop} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                    <div className="p-4 md:p-5 text-center">
                                        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                        </svg>
                                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn muôn xoá đơn vị {unitDeleteName}?</h3>
                                        <button 
                                            data-modal-hide="popup-modal" 
                                            type="button" 
                                            onClick={() => handleSubmitDeleteUnit()}
                                            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                            Có
                                        </button>
                                        <button 
                                            data-modal-hide="popup-modal" 
                                            type="button" 
                                            onClick={handleCloseDeletePop}
                                            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            Không
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : ''}

                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Tên đơn vị
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unitsList?.map((unit, index) => (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                                {unit?.name}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white flex justify-center">
                                                <button
                                                    onClick={() => handleOpenEditUnit(unit)}
                                                    className="py-2 px-5 bg-secondary font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center"
                                                >
                                                    <FaEdit className="mr-1" />
                                                    Chỉnh sửa
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 ">
                                                <button
                                                    onClick={() => handleOpenDeletePop(unit)}
                                                    className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center"
                                                >
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
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideIn {
                    from {
                        transform: translateY(-20%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-in-out;
                }

                .animate-slideIn {
                    animation: slideIn 0.3s ease-in-out;
                }
            `}</style>
        </div>
    )
}

export default UnitManagement;
