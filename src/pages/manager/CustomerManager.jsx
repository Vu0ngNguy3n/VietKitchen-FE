import SidebarManager from "../../components/managerComponent/SidebarManager";
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { getUser } from "../../utils/constant";

function CustomerManager() {
    const [statusTable, setStatusTable] = useState("enable");
    const [selectAll, setSelectAll] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [listCustomers, setListCustomers] = useState([])
    const [listCustomersDisplay, setListCustomersDisplay] = useState([]);
    const [restaurantId, setRestaurantId] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [name, setName] = useState();
    const [address, setAddress] = useState();
    const [isOpenCreatePop, setIsOpenCreatePop] = useState(false);
    const [isCreate, setIsCreate] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [idCustomer,setIdCustomer] = useState('');    
    const [search, setSearch] = useState('');
    const navigate = useNavigate();


    useEffect(() =>{ 
        const user = getUser();
        setRestaurantId(user.restaurantId);

        axiosInstance
        .get(`/api/customers/rankingCustomer/${user?.restaurantId}`)
        .then(res => {
            const data = res.data;
            setListCustomers(data);
            setListCustomersDisplay(data);
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

    const handleOpenCreatePop = () => {
        setIsOpenCreatePop(true);
        setIsCreate(true);
        setIsEdit(false);
    }

    const handleCloseCreatePop = () =>{
        setIsOpenCreatePop(false);
        setIsCreate(false);
        setIsEdit(false);
        setAddress('');
        setName('');
        setPhoneNumber("");
    }

    const handleSubmitCreateCustomer = () => {
        if(phoneNumber.trim() === '' || name.trim() === '' || address.trim() === ''){
            toast.warn("Vui lòng không được bỏ trống thông tin khách hàng")
        }else{
            if(isCreate){
                const customer = {
                    phoneNumber: phoneNumber,
                    name: name,
                    address: address,
                    restaurantId: restaurantId
                }
                axiosInstance
                .post(`/api/customers/create`, customer)
                .then(res => {
                    toast.success(`Tạo thông tin khách hàng ${name} thành công`);
                    handleCloseCreatePop();
                    setIsUpdate(!isUpdate);
                })
                .catch(err => {
                    if(err.response){
                        const errRes = err.response.data;
                        toast.error(errRes.message);
                    }else if(err.request){
                        toast.error("Không thể gửi yêu cầu đến máy chủ!")
                    }else{
                        toast.error(err.message);
                    }
                })
            }else if(isEdit){
                const customer = {
                    id: idCustomer,
                    phoneNumber: phoneNumber,
                    name: name,
                    address: address,
                    restaurantId: restaurantId
                }

                axiosInstance
                .put(`/api/customers/update`,customer)
                .then(res => {
                    toast.success(`Cập nhật thông tin khách hàng ${name} thành công`)
                    setIsUpdate(!isUpdate);
                    handleCloseCreatePop();
                })
                .catch(err => {
                    if(err.response){
                        const errRes = err.response.data;
                        toast.error(errRes.message);
                    }else if(err.request){
                        toast.error("Không thể gửi yêu cầu đến máy chủ!")
                    }else{
                        toast.error(err.message);
                    }
                })
            }
        }
    }

    const handleOpenEdit = (customer) => {
        setIsEdit(true);
        setIsOpenCreatePop(true);
        setIsCreate(false);
        setName(customer?.name);
        setAddress(customer?.address);
        setPhoneNumber(customer?.phoneNumber);
        setIdCustomer(customer?.id);
    }

    useEffect(() => {
        const newListCustomers = listCustomers?.filter(c => (c?.phoneNumber.includes(search) || c?.name.toLowerCase().includes(search.toLowerCase())))
        setListCustomersDisplay(newListCustomers)
    },[search])

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
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Nhập SĐT/Tên khách hàng"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div>
                                    <button 
                                        onClick={() => handleOpenCreatePop()}
                                        className="py-2 px-5 bg-blue-500 font-semibold text-white rounded hover:bg-blue-700 transition-all duration-300 flex items-center">
                                        <FaPlus className="mr-1" />
                                        Thêm khách hàng
                                    </button>
                                </div>
                            </div>
                        </div>
                        {(isOpenCreatePop) ? (
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-50 animate-slideIn">
                                    <button
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl "
                                        onClick={handleCloseCreatePop}
                                    >
                                        &times;
                                    </button>
                                    <h2 className="text-xl font-semibold mb-4">
                                        {isCreate ? 'Thêm đơn vị tính' : 'Cập nhật đơn vị tính'}
                                    </h2>
                                    <div className="mb-4">
                                        <label className="block mb-2">Số điện thoại</label>
                                        <input
                                            type="number"
                                            placeholder="Số điện thoại"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            disabled={isEdit ? true : false}
                                            className={`w-full px-3 py-2 border rounded-md ${isEdit ? 'cursor-not-allowed' : ''}`}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Tên khách hàng</label>
                                        <input
                                            type="text"
                                            placeholder="Tên khách hàng"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Địa chỉ</label>
                                        <input
                                            type="text"
                                            placeholder="Địa chỉ"
                                            value={address}
                                            onChange={e => setAddress(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={handleCloseCreatePop}
                                            className="py-2 px-5 bg-white border-2 border-black  font-semibold text-gray-600 rounded  transition-all duration-300"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            onClick={() => handleSubmitCreateCustomer()}
                                            className="py-2 px-5 bg-blue-500 font-semibold text-white rounded hover:bg-blue-700 transition-all duration-300"
                                        >
                                            {isCreate ? 'Thêm' : 'Cập nhật'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : null}

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
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listCustomersDisplay?.map((c, index) => (
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
                                            <td className="px-6 py-4">{c.address}</td>
                                            <td className="px-6 py-4">{c.point}</td>
                                            <td className="px-6 py-4 flex space-x-2">
                                                <button 
                                                    onClick={() => handleOpenEdit(c)}
                                                    className="py-2 px-5 bg-secondary font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center">
                                                    <FaEdit className="mr-1" />
                                                    Chỉnh sửa
                                                </button>
                                                
                                            </td>
                                        </tr>
                                    ))}
                                    {listCustomersDisplay?.length === 0 && (
                                        <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                            <td className="w-4 p-4"></td>
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
    );
}

export default CustomerManager;
