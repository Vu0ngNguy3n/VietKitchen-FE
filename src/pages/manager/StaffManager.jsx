import SidebarManager from "../../components/managerComponent/SidebarManager";
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaKey } from "react-icons/fa";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useUser } from "../../utils/constant";
import { toast } from "react-toastify";
import validator, { isRFC3339 } from "validator";

function StaffManager() {

    const [listEmployees, setListEmployees] = useState([])
    const [listEmployeesDisplay, setListEmployeesDisplay] = useState([]);
    const [openPop, setOpenPop] = useState(false);
    const [accountStorage, setAccountStorage] = useState();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [listRoles, setListRoles] = useState([]);
    const [currentRole, setCurrentRole] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isAddEmployee, setIsAddEmployee] = useState(false);
    const [isCreate, setIsCreate]= useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [employeeId, setEmployeeId] = useState();
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [isOpenChangePass, setIsOpenChangePass] = useState(false);
    const [employeeDelete, setEmployeeDelete] = useState();
    const [employeeChangePassword, setEmployeeChangePassword] = useState();
    const [search, setSearch] = useState('');
    const account = useUser();

    useEffect(() => {
        setAccountStorage(account);

        axiosInstance
        .get("/api/role")
        .then(res => {
            const data = res.data.result;
            if(data.length > 0){
                setListRoles(data)
                setCurrentRole(data[0]?.id)
                console.log(data);
            }
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

    useEffect(() => {
        setAccountStorage(account);
        axiosInstance
        .get(`/api/employee/restaurant/${account?.accountId}`)
        .then(res => {
            const data = res.data.result;
            setListEmployees(data);
            setListEmployeesDisplay(data);
            setSearch('');
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
    },[isAddEmployee])

    
    const handleOpenPopup = () => {
        setIsCreate(true);
        setIsEdit(false);
        setOpenPop(true);
        setPassword('');
        setConfirmPassword('');
    }

    const handleClosePopup = () => {
        setOpenPop(false);
        clearInput();
        setPassword('');
        setConfirmPassword('');
    }

    const clearInput = () => {
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setEmployeeName('');
        setPhoneNumber('');
    }

    const handleCreateEmployee = () => {
        if(username.trim() === '' || employeeName.trim() === '' || password.trim() === '' || confirmPassword.trim() === '' ){
            toast.warn("Vui lòng điền đầy đủ thông tin")
        }else if(!validator.isMobilePhone(phoneNumber, 'vi-VN')){
            toast.warn("Số điện thoại không đúng định dạng.")
        }else if(password.trim() !== confirmPassword.trim()){
            toast.warn("Mật khẩu không trùng khớp")
        }else{
            
            if(isCreate){
                const newEmployee = {
                    username: username,
                    password: password,
                    employeeName: employeeName,
                    phoneNumber: phoneNumber,
                    accountId: accountStorage.accountId,
                    roleId: +currentRole
                }

                axiosInstance
                .post("/api/employee/create",newEmployee)
                .then(res => {
                    toast.success(`Tạo tài khoản nhân viên ${username} thành công`)
                    setOpenPop(false);
                    setIsAddEmployee(!isAddEmployee)
                    clearInput();
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
                const newEmployee = {
                    employeeName: employeeName,
                    phoneNumber: phoneNumber,
                    roleId: +currentRole
                }

                axiosInstance
                .put(`/api/employee/${employeeId}`,newEmployee)
                .then(res => {
                    toast.success(`Cập nhât tài khoản nhân viên ${username} thành công`)
                    setOpenPop(false);
                    setIsAddEmployee(!isAddEmployee)
                    clearInput();
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

    const handleEditEmployee = (employee) => {
        setIsEdit(true);
        setIsCreate(false);
        setOpenPop(true);
        setUsername(employee?.username);
        setEmployeeName(employee?.employeeName);
        setEmployeeId(employee?.id)
        setPhoneNumber(employee?.phoneNumber);
        setCurrentRole(employee?.role.id)
    }

    const handleDeleteEmployee = (employee) => {
        setIsOpenDelete(true);
        setEmployeeDelete(employee)
    }

    const handleSubmitDelete = () => {
        closePopDelete();

        axiosInstance
        .delete(`/api/employee/delete/${employeeDelete?.id}`)
        .then(res => {
            toast.success(`Xoá nhân viên ${employeeDelete?.employeeName} thành công!`)
            setIsAddEmployee(!isAddEmployee);
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

    const closePopDelete = () => {
        setIsOpenDelete(false);
    }

    useEffect(() => {
        const newListEmployees = listEmployees?.filter(e => (e?.employeeName.toLowerCase().includes(search) || e?.username.includes(search.toLowerCase()) || e?.role.name.toLowerCase().includes(search.toLowerCase()) ))
        setListEmployeesDisplay(newListEmployees);
    },[search])


    const handleChangePhone = (value) => {
        if(!isNaN(value) && value.length<=10){
            setPhoneNumber(value);
        }
    }

    const handleChangeName = (value) => {
        if(value.length <= 20){
            setUsername(value)
        }
    }

    const handleChangeNameEmployee = (value) => {
        if(value.length <= 20){
            setEmployeeName(value)
        }
    }

    const handleChangePassword = (employee) => {
        setIsOpenChangePass(true);
        setEmployeeChangePassword(employee)
    }

    const handleOpenChangePass = () => {
        setIsOpenChangePass(true);
    }

    const handleCloseChangePass = () => {
        setIsOpenChangePass(false);
        setPassword('');
        setConfirmPassword('');
    }

    const handleSubmitChangePass = () =>  {
        if(password !== confirmPassword){
            toast.warn("Mật khẩu không trùng khớp")
            return
        }
        axiosInstance
        .put(`/api/employee/${employeeChangePassword?.id}/change-password/${password}`)
        .then(res => {
            toast.success(`Đổi mật khẩu cho nhân viên ${employeeChangePassword?.employeeName} thành công`)
            handleCloseChangePass();
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
                        <h1 className="font-black text-3xl">Quản lý nhân viên</h1>

                        <div className="flex mt-6 flex-col gap-4 md:flex-row justify-between">
                            <div className="">
                                <div className="relative grow rounded-md border-2 border-gray-300">
                                    <FaSearch className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 pl-10 outline-none italic "
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Nhập tên nhân viên"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div>
                                    <button
                                         className="py-2 px-5 bg-blue-500 font-semibold text-white rounded hover:bg-blue-500 transition-all duration-300 flex items-center"
                                         onClick={handleOpenPopup}
                                         >
                                        <FaPlus className="mr-1" />
                                        Thêm nhân viên
                                    </button>
                                </div>
                            </div>
                        </div>
                        {openPop?<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-50 overflow-y-auto max-h-screen ">
                                    <button
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
                                        onClick={handleClosePopup}
                                    >
                                        &times;
                                    </button>
                                    <h2 className="text-xl font-semibold mb-4">
                                        {isCreate ? "Thêm nhân viên" : "Cập nhật thông tin nhân viên"}
                                    </h2>
                                   { (isCreate && <div className="mb-4">
                                        <label className="block mb-2">Tên tài khoản nhân viên <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Tên tài khoản nhân viên"
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={username}
                                            onChange={e => handleChangeName(e.target.value)}
                                        />
                                    </div>)}
                                    <div className="mb-4">
                                        <label className="block mb-2">Tên nhân viên <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Tên nhân viên"
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={employeeName}
                                            onChange={e => handleChangeNameEmployee(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Số điện thoại nhân viên <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Số điện thoại nhân viên"
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={phoneNumber}
                                            onChange={e => handleChangePhone(e.target.value)}
                                        />
                                    </div>
                                    {!isEdit && (
                                        <div className="mb-4">
                                            <label className="block mb-2">Mật khẩu <span className="text-red-500">*</span></label>
                                            <input
                                                type="password"
                                                placeholder="Mật khẩu"
                                                className="w-full px-3 py-2 border rounded-md"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                            />
                                        </div>
                                    )}
                                    
                                    {!isEdit && (
                                        <div className="mb-4">
                                            <label className="block mb-2">Xác nhận mật khẩu <span className="text-red-500">*</span></label>
                                            <input
                                                type="password"
                                                placeholder="Xác nhận mật khẩu"
                                                className="w-full px-3 py-2 border rounded-md"
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="mb-4">
                                        <label className="block mb-2">Loại nhân viên <span className="text-red-500">*</span></label>
                                        
                                        <select 
                                            id="countries" 
                                            value={currentRole}
                                            onChange={e => setCurrentRole(e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                            focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                            {listRoles?.map((role, index) =>
                                                <option value={role?.id} key={index}>{role?.name === "WAITER" ? "Bồi bàn" : (role?.name === "CHEF" ?  "Đầu bếp" : "Lễ tân")}</option>
                                            )}
                                        </select>

                                    </div>
                                   
                                    
                                    <div className="flex justify-end gap-2">
                                        {/* <button
                                            className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-red-700 transition-all duration-300"
                                            onClick={handleClosePopup}
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            className="py-2 px-5 bg-blue-500 font-semibold text-white rounded hover:bg-blue-500 transition-all duration-300"
                                            onClick={handleCreateEmployee}
                                        >
                                            {isCreate ?"Thêm":"Cập nhật"}
                                        </button> */}
                                        <button
                                            type="submit" 
                                             onClick={handleCreateEmployee}
                                            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                         >
                                            <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                                            {isCreate ?"Thêm":"Cập nhật"}
                                        </button>
                                    </div>
                                </div>
                            </div>:""}
                        
                        {isOpenChangePass && (
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-50 overflow-y-auto max-h-screen ">
                                    <button
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
                                        onClick={handleCloseChangePass}
                                    >
                                        &times;
                                    </button>
                                    
                                    <div className="mb-4">
                                        <label className="block mb-2">Mật khẩu mới <span className="text-red-500">*</span></label>
                                        <input
                                            type="password"
                                            placeholder="Mật khẩu"
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                    </div>
                                
                                    <div className="mb-4">
                                        <label className="block mb-2">Xác nhận mật khẩu<span className="text-red-500">*</span></label>
                                        <input
                                            type="password"
                                            placeholder="Xác nhận mật khẩu"
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="flex justify-end gap-2">
                                        <button
                                            className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-red-700 transition-all duration-300"
                                            onClick={handleCloseChangePass}
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            className="py-2 px-5 bg-blue-500 font-semibold text-white rounded hover:bg-blue-500 transition-all duration-300"
                                            onClick={handleSubmitChangePass}
                                        >
                                            Đổi mật khẩu
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    
                        {isOpenDelete && (
                            <div id="popup-delete" className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                                <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700 animate-slideIn">
                                    <button type="button" onClick={closePopDelete} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                    <div className="p-4 md:p-5 text-center">
                                        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                        </svg>
                                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn muôn xoá nhân viên <span className="font-semibold">{employeeDelete?.employeeName}</span>?</h3>
                                        <button 
                                            data-modal-hide="popup-modal" 
                                            type="button" 
                                            onClick={() => handleSubmitDelete()}
                                            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                            Có
                                        </button>
                                        <button 
                                            data-modal-hide="popup-modal" 
                                            type="button" 
                                            onClick={closePopDelete}
                                            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            Không
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
                                            Tên Nhân Viên
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Tên tài khoản
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Số điện thoại
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Vai trò
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <span className="sr-only">Chỉnh sửa</span>
                                            {/* <span className="sr-only">Xóa</span> */}
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <span className="sr-only">Đổi mật khẩu</span>
                                            {/* <span className="sr-only">Xóa</span> */}
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <span className="sr-only">Xoá</span>
                                            {/* <span className="sr-only">Xóa</span> */}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listEmployeesDisplay?.map((e, index) => (
                                        <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {e?.employeeName}
                                            </th>
                                            <td className="px-6 py-4">
                                                {e?.username}
                                            </td>
                                            <td className="px-6 py-4">
                                                {e?.phoneNumber}
                                            </td>
                                            <td className="px-6 py-4">
                                                {e?.role.name === "WAITER" ? "Bồi bàn" : (e?.role.name === "CHEF" ?  "Đầu bếp" : "Lễ tân")}
                                            </td>
                                            <td className="px-6 py-4 ">
                                                <button 
                                                    onClick={() => handleEditEmployee(e)}
                                                    className="py-2 px-5 bg-blue-500 font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center">
                                                    <FaEdit className="mr-1" />
                                                    Chỉnh sửa
                                                </button>
                                                
                                            </td>
                                            <td className="px-6 py-4 ">
                                                <button 
                                                    onClick={() => handleChangePassword(e)}
                                                    className="py-2 px-5 bg-secondary font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center">
                                                    <FaKey className="mr-1" />
                                                    Đổi mật khẩu
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 ">
                                                <button 
                                                    onClick={() => handleDeleteEmployee(e)}
                                                    className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center">
                                                    <FaTrash className="mr-1" />
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {listEmployeesDisplay?.length === 0 && (
                                        <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                            <td className="px-6 py-4 text-red-500">
                                                Không tìm thấy thông tin nhân viên tương ứng
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
    )
}

export default StaffManager;
