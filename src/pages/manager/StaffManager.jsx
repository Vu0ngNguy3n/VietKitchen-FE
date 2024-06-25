import SidebarManager from "../../components/managerComponent/SidebarManager";
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { getUser } from "../../utils/constant";
import { toast } from "react-toastify";

function StaffManager() {

    const [listEmployees, setListEmployees] = useState([])
    const [openPop, setOpenPop] = useState(false);
    const [accountStorage, setAccountStorage] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [employeeName, setEmployeeName] = useState();
    const [listRoles, setListRoles] = useState([]);
    const [currentRole, setCurrentRole] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [isAddEmployee, setIsAddEmployee] = useState(false);
    const [isCreate, setIsCreate]= useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [employeeId, setEmployeeId] = useState();

    useEffect(() => {
        const account = getUser();
        setAccountStorage(account);

        axiosInstance
        .get("/api/role")
        .then(res => {
            const data = res.data.result;
            setListRoles(data)
            setCurrentRole(data[0]?.id)
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
         const account = getUser();
        setAccountStorage(account);
        axiosInstance
        .get(`/api/employee/restaurant/${account?.accountId}`)
        .then(res => {
            const data = res.data.result;
            setListEmployees(data);
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
    }

    const handleClosePopup = () => {
        setOpenPop(false);
        clearInput();
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
                    password: password,
                    employeeName: employeeName,
                    phoneNumber: phoneNumber,
                    roleId: +currentRole
                }
                console.log(newEmployee);

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
                                        placeholder="Nhập tên nhân viên"
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
                                        Thêm nhân viên
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
                                        {isCreate ? "Thêm nhân viên" : "Cập nhật thông tin nhân viên"}
                                    </h2>
                                   { (isCreate && <div className="mb-4">
                                        <label className="block mb-2">Tên tài khoản nhân viên</label>
                                        <input
                                            type="text"
                                            placeholder="Tên tài khoản nhân viên"
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                        />
                                    </div>)}
                                    <div className="mb-4">
                                        <label className="block mb-2">Tên nhân viên</label>
                                        <input
                                            type="text"
                                            placeholder="Tên nhân viên"
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={employeeName}
                                            onChange={e => setEmployeeName(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Số điện thoại nhân viên</label>
                                        <input
                                            type="text"
                                            placeholder="Số điện thoại nhân viên"
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={phoneNumber}
                                            onChange={e => setPhoneNumber(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Mật khẩu</label>
                                        <input
                                            type="password"
                                            placeholder="Mật khẩu"
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Xác nhận mật khẩu</label>
                                        <input
                                            type="password"
                                            placeholder="Xác nhận mật khẩu"
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block mb-2">Loại nhân viên</label>
                                        
                                        <select 
                                            id="countries" 
                                            value={currentRole}
                                            onChange={e => setCurrentRole(e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                            focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                            {listRoles?.map((role, index) =>
                                                <option value={role?.id} key={index}>{role?.name}</option>
                                            )}
                                        </select>

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
                                            onClick={handleCreateEmployee}
                                        >
                                            {isCreate ?"Thêm":"Cập nhật"}
                                        </button>
                                    </div>
                                </div>
                            </div>:""}

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
                                            <span className="sr-only">Xóa</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listEmployees?.map((e, index) => (
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
                                                {e?.role.name}
                                            </td>
                                            <td className="px-6 py-4 flex space-x-2">
                                                <button 
                                                    onClick={() => handleEditEmployee(e)}
                                                    className="py-2 px-5 bg-secondary font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center">
                                                    <FaEdit className="mr-1" />
                                                    Chỉnh sửa
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteEmployee(e)}
                                                    className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center">
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
