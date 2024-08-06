import { useEffect, useState } from "react";
import Dashboardview from "../../components/adminComponent/DashboardView"
import Sidebar from "../../components/adminComponent/Sidebar"
import { GrUpdate } from "react-icons/gr";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";


function PackageDetail() {

    const navigate = useNavigate();
    const [permissionsList, setPermissionsList] = useState();
    const [isOpenDropDown, setIsOpenDropDown] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [packageName, setPackageName] = useState('');
    const [pricePerMonth, setPricePerMonth] = useState('');
    const [pricePerYear, setPricePerYear] = useState('');
    const [isOpenModal, setIsOpenModal] = useState(false);

     const handleChangePriceMonth = (event) => {
        const rawValue = event.target.value.replace(/[^\d]/g, ''); // Loại bỏ các ký tự không phải số
        setPricePerMonth(rawValue);

       
    };

    const handleChangePriceYear = (event) => {
        const rawValue = event.target.value.replace(/[^\d]/g, ''); // Loại bỏ các ký tự không phải số
        setPricePerYear(rawValue);
    };

    useEffect(() => {
        axiosInstance
        .get("/api/permission")
        .then(res => {
            setPermissionsList(res.data.result)
            console.log(res.data.result);
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

    const handleModal = () => {
        if(isOpenModal === false){
             if(selectedOptions.length <= 0){
                toast.warn("Vui lòng chọn chức năng cho gói")
            }else if(packageName.trim() === '' || pricePerMonth === '' || pricePerYear === ''){
                toast.warn("Vui lòng nhập thông tin của gói")
            }else{
                setIsOpenModal(true)
            }
        }else{
            setIsOpenModal(false)
        }
    }

    const handleCreatePackage = async() => {
       const newPackage = {
                    packName:packageName.trim(),
                    permissions: selectedOptions,
                    pricePerMonth: pricePerMonth,
                    pricePerYear: pricePerYear
                }
        
        axiosInstance
        .post("/api/package", newPackage)
        .then(res => {
            toast.success("Tạo gói thành công");
            navigate('/admin/packages');
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

    

     const handleOptionToggle = (optionId) => {
        if (selectedOptions.includes(optionId)) {
            setSelectedOptions(selectedOptions.filter(option => option !== optionId));
        } else {
            setSelectedOptions([...selectedOptions, optionId]);
        }
    };

    const handleOpenDropdown = ( ) => {
        setIsOpenDropDown(!isOpenDropDown)
    }

    const handleUpdate = () => {
        navigate("/admin/accountsManagement");
    }

    return (
        <div className="">
            <div className="flex  ">
                <div className="basis-[12%] h-[100vh]">
                    <Sidebar />
                </div>
                <div className="basis-[88%] border h-[100vh]">
                    <Dashboardview />
                    <div className="min-w-[40]x rounded-lg bg-white p-16 shadow min-h-[90vh] mt-2">
                        <h1 className="font-black text-3xl">Tạo gói mới</h1>

                        <htmlForm className="p-4 md:p-5">
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="col-span-2 ">
                                    <label for="packageName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên gói</label>
                                    <input
                                        type="text"
                                        name="packageName"
                                        id="packageName"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                                         block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white 
                                         dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                                        placeholder="Tên gói"
                                        value={packageName}
                                        onChange={e => setPackageName(e.target.value)}
                                        required=""
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label for="pricePerMonth" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Giá theo tháng</label>
                                    <input
                                        type="text"
                                        name="pricePerMonth"
                                        id="pricePerMonth"
                                        value={pricePerMonth}
                                        onChange={e => handleChangePriceMonth(e)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                        focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 
                                        dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Giá theo tháng" required="" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label for="pricePerYear" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Giá theo năm</label>
                                    <input 
                                    type="text" 
                                    name="pricePerYear"
                                     id="pricePerYear" 
                                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 
                                     block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 
                                     dark:focus:border-primary-500" 
                                     value={pricePerYear}
                                     onChange={e => handleChangePriceYear(e)}
                                     placeholder="Giá theo năm" required="" />
                                </div>
                               
                                <div className="col-span-2 ">
                                    <label for="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Loại gói</label>
                                    
                                    <div className="flex justify-between">
                                        <button id="dropdownSearchButton" data-dropdown-toggle="dropdownSearch" 
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg
                                        hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 
                                        dark:focus:ring-blue-800 w-[49%] h-10" type="button"  onClick={() => handleOpenDropdown()}>Danh sách các chức năng 
                                        <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" 
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                        </svg></button>

                                        <div id="dropdownSearch" className={`z-10  bg-white ${isOpenDropDown ? '' :"hidden"} rounded-lg shadow w-[49%] border-gray-300 dark:bg-gray-700 `}>
                                        
                                            <ul className="h-48 px-3 pb-3 mt-4 overflow-y-auto text-sm text-gray-700 dark:text-gray-200 flex" aria-labelledby="dropdownSearchButton">
                                                {permissionsList?.map((permission, index) => (
                                                    <li key={index}>
                                                        <div className="flex items-center p-2 mx-4 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                                            <input 
                                                            type="checkbox" 
                                                            id={`${permission?.id}`}
                                                            value={permission?.id}
                                                            checked={selectedOptions.includes(permission?.id)}
                                                            onChange={() => handleOptionToggle(permission?.id)}
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded 
                                                            focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 
                                                            dark:bg-gray-600 dark:border-gray-500"/>
                                                            <label htmlFor={`${permission?.id}`} className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">{permission?.description}</label>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <button
                                type="submit"
                                onClick={() => handleModal()}
                                className="text-white transition ease-in-out duration-300 inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <GrUpdate className="mr-2" />
                                Tạo gói
                            </button>
                        </htmlForm>
                    </div>

                </div>

                <div id="popup-modal" tabindex="-1" className={`${isOpenModal?'':'hidden'} fixed inset-0 z-50 flex items-center justify-center backdrop-filter backdrop-blur-lg
                 bg-gray-500 bg-opacity-50`}>
                    <div className="relative p-4 w-full max-w-md max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <button 
                                type="button" 
                                onClick={() => handleModal()}
                                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg 
                                text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-4 md:p-5 text-center">
                                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                </svg>
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn chắc chắn muốn tạo gói này</h3>
                                <button 
                                data-modal-hide="popup-modal" 
                                type="button" 
                                onClick={() => handleCreatePackage()}
                                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800
                                 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                    Tạo gói
                                </button>
                                <button 
                                data-modal-hide="popup-modal"
                                 type="button"
                                 onClick={() => handleModal()}
                                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 
                                  hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 
                                  dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Không, cảm ơn</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PackageDetail