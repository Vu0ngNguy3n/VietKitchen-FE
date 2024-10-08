import React, { useCallback, useEffect, useState } from 'react';
import SidebarManager from "../../components/managerComponent/SidebarManager";
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard";
import { IoMdAdd } from "react-icons/io";
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useUser } from '../../utils/constant';
import _ from 'lodash';

function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [categoriesDisplay, setCategoriesDisplay] = useState([]);
    const [isOpenCreatePop, setIsOpenCreatePop] = useState(false);
    const [isOpenDeletePop, setIsOpenDeletePop] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isCreate, setIsCreate] = useState(true);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [size, setSize] = useState(6);
    const [totalCategories, setTotalCategories] = useState();
    const [isSearch, setIsSearch] = useState(false);
    const user = useUser()

    useEffect(() => {


        axiosInstance
        .get(`/api/dish-category/${user?.restaurantId}/page`,{
            params: {
                page: currentPage,
                size: size,
                query: search
            }
        })
        .then(res => {
            const data = res.data.result;
            setTotalCategories(data.totalItems)
            setCategories(data.results)
            setCategoriesDisplay(data.results)
        })
        .catch(err => {
            if (err.response) {
                const errorRes = err.response.data;
                toast.error(errorRes.message);
            } else if (err.request) {
                toast.error("Request failed");
            } else {
                toast.error(err.message);
            }
        });
    }, []);

    const handleDebouncedChange = useCallback(
        _.debounce((value) => {
            setIsSearch(prev => !prev);
            setCurrentPage(1)
        }, 500),
        []
    )

    useEffect(() => {
        handleDebouncedChange(search)

        return () => {
            handleDebouncedChange.cancel();
        }
    },[search])

    const handleClick = (page) => {
        if(page > 0 && page <= (totalCategories / size + 1)){
            setCurrentPage(page);
        }

    };

    useEffect(() => {
        axiosInstance
        .get(`/api/dish-category/${user?.restaurantId}/page`,{
            params: {
                page: currentPage,
                size: size,
                query: search
            }
        })
        .then(res => {
            const data = res.data.result;
            setTotalCategories(data.totalItems)
            setCategories(data.results)
            setCategoriesDisplay(data.results)
        })
        .catch(err => {
            if (err.response) {
                const errorRes = err.response.data;
                toast.error(errorRes.message);
            } else if (err.request) {
                toast.error("Request failed");
            } else {
                toast.error(err.message);
            }
        });
    },[currentPage, isSearch])



    const handleOpenCreatePop = () => {
        setIsOpenCreatePop(true);
        setIsCreate(true);
        setName('');
        setDescription('');
    };

    const handleOpenEditPop = (category) => {
        setIsOpenCreatePop(true);
        setIsCreate(false);
        setName(category.name);
        setDescription(category.description);
        setCurrentCategoryId(category.id);
    };

    const handleCloseCreatePop = () => {
        setIsOpenCreatePop(false);
    };

    const handleOpenDeletePop = (category) => {
        setIsOpenDeletePop(true);
        setName(category.name);
        setCurrentCategoryId(category.id);
    };

    const handleCloseDeletePop = () => {
        setIsOpenDeletePop(false);
    };

    const handleSubmitCreateCategory = () => {
        if (name.trim() === '') {
            toast.warn("Tên loại món ăn không dược để trống");
        } else if(description.trim() === ''){
            toast.warn('Miêu tả loại món ăn không dược để trống')
        }else {
            const accountId = user?.accountId;

            const category = {
                name: name,
                description: description,
                // accountId: accountId,
                restaurantId: user?.restaurantId
            };

            axiosInstance
                .post('/api/dish-category/create', category)
                .then(res => {
                    if (res.data.code === 200) {
                        toast.success("Thêm loại món ăn thành công");
                        setCategories([...categories, res.data.result]);
                        setCategoriesDisplay([...categories, res.data.result])
                        setCurrentPage(1);
                        setIsSearch(prev => !prev)
                        handleCloseCreatePop();
                    } else {
                        toast.error("Thêm mới loại món ăn thất bại");
                    }
                })
                .catch(err => {
                    if (err.response) {
                        const errorRes = err.response.data;
                        toast.error(errorRes.message);
                    } else if (err.request) {
                        toast.error("Request failed");
                    } else {
                        toast.error(err.message);
                    }
                });
        }
    };

    const handleSubmitUpdateCategory = () => {
        if (name.trim() === '') {
            toast.warn("Tên loại món ăn không được bỏ trống");
        } else if(description.trim() === ''){
            toast.warn("Miêu tả loại món ăn không được bỏ trống")
        }else{
            const accountId = user?.accountId;

            const category = {
                name: name,
                description: description,
                // accountId: accountId
                restaurantId: user?.restaurantId
            };

            axiosInstance
                .put(`/api/dish-category/${currentCategoryId}`, category)
                .then(res => {
                    if (res.data.code === 200) {
                        toast.success("Cập nhật loại món ăn thành công");
                        const updatedCategories = categories.map(cat => 
                            cat.id === currentCategoryId ? res.data.result : cat
                        );
                        setCategories(updatedCategories);
                        setCategoriesDisplay(updatedCategories);
                        handleCloseCreatePop();
                    } else {
                        toast.error("Cập nhật loại món ăn thất bại");
                    }
                })
                .catch(err => {
                    if (err.response) {
                        const errorRes = err.response.data;
                        toast.error(errorRes.message);
                    } else if (err.request) {
                        toast.error("Request failed");
                    } else {
                        toast.error(err.message);
                    }
                });
        }
    };

    const handleDeleteCategory = () => {
        axiosInstance
            .delete(`/api/dish-category/${currentCategoryId}`)
            .then(res => {
                if (res.data.code === 200) {
                    toast.success("Xóa loại món ăn thành công");
                    const updatedCategories = categories.filter(cat => cat.id !== currentCategoryId);
                    setCategories(updatedCategories);
                    setCategoriesDisplay(updatedCategories);
                    handleCloseDeletePop();
                } else {
                    toast.error("Xóa loại món ăn thất bại");
                }
            })
            .catch(err => {
                if (err.response) {
                    const errorRes = err.response.data;
                    toast.error(errorRes.message);
                } else if (err.request) {
                    toast.error("Request failed");
                } else {
                    toast.error(err.message);
                }
            });
    };

    const handleChangeCategoryName = (name) => {
        if(name?.length <=30 ){
            setName(name);
        }
    }

    const handleChangeDescription = (descript) => {
        if(descript?.length <= 250){
            setDescription(descript)
        }
    }

    // useEffect(() => {
    //     const newCategories = categories?.filter(c => c?.name.toLowerCase().includes(search.toLowerCase().trim()))
    //     setCategoriesDisplay(newCategories);
    // },[search])

    return (
        <div className="">
            <div className="flex">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarManager />
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <HeaderManagerDashboard />
                    <div className="min-w-[40]x rounded-lg bg-white p-12 shadow min-h-[90vh] mt-2">
                        <h1 className="font-black text-3xl mb-4">Quản lý loại món ăn</h1>
                        <div className="flex justify-between">
                            <div className="">
                                <div className="relative grow rounded-md border-2 border-gray-300">
                                    <FaSearch className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 pl-10 outline-none italic "
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Nhập tên loại món ăn"
                                    />
                                </div>
                            </div>
                            <button
                                className="py-2 px-3 bg-blue-500 font-semibold text-white rounded hover:bg-blue-700 transition-all duration-300 flex items-center"
                                onClick={handleOpenCreatePop}
                            >
                                <IoMdAdd />Thêm loại món ăn
                            </button>
                        </div>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Tên loại món ăn
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Mô tả
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Hành động
                                        </th>
                                        {/* <th scope="col" className="px-6 py-3">
                                            
                                        </th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoriesDisplay?.map((category) => (
                                        <tr key={category.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <td className="px-6 py-4 break-words max-w-xs">
                                                {category.name}
                                            </td>
                                            <td className="px-6 py-4 break-words max-w-xs">
                                                {category.description}
                                            </td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <button
                                                    className="py-2 px-5 bg-blue-500 font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center"
                                                    onClick={() => handleOpenEditPop(category)}
                                                >
                                                    <FaEdit className="mr-1" />
                                                    Cập nhật
                                                </button>
                                            </td>
                                            {/* <td className="px-6 py-4 break-words max-w-xs">
                                                <button
                                                    className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center"
                                                    onClick={() => handleOpenDeletePop(category)}
                                                >
                                                    <FaTrash className="mr-1" />
                                                    Xóa
                                                </button>
                                            </td> */}
                                        </tr>
                                    ))}
                                    {categoriesDisplay?.length===0 && (
                                        <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                            <td className="px-6 py-4 break-words max-w-xs text-red-500">
                                                Không tìm thấy thông tin loại món ăn tương ứng
                                            </td>
                                            <td className="px-6 py-4 break-words max-w-xs"></td>
                                            <td className="px-6 py-4 break-words max-w-xs"></td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Hiển thị <span className="font-semibold text-gray-900 dark:text-white">{1 + size*(currentPage-1)}-{(size + size*(currentPage-1) <= totalCategories ? size + size*(currentPage-1) : totalCategories)}</span> trong <span className="font-semibold text-gray-900 dark:text-white">{totalCategories} </span>loại món ăn</span>
                                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                    <li onClick={() => handleClick(currentPage-1)}>
                                        <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Trước</a>
                                    </li>
                                    {Array.from({ length: (totalCategories%size > 0 ?totalCategories/size+1 : totalCategories/size) }).map((_, index) => (
                                        <li onClick={() => setCurrentPage(index+1)}>
                                            <a href="#" aria-current="page" className={`flex items-center justify-center px-3 h-8 leading-tight ${
                                                currentPage === index+1
                                                    ? 'text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                                                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                                                }`}>{index+1}</a>
                                        </li>
                                    ))}
                                    <li onClick={() => handleClick(currentPage+1)}>
                                         <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Sau</a>
                                    </li>
                                    
                                </ul>
                            </nav>
                        </div>

                    </div>
                </div>
            </div>

            {isOpenCreatePop && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-50 animate-slideIn">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl "
                            onClick={handleCloseCreatePop}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-4">
                            {isCreate ? "Thêm loại món ăn" : "Cập nhật loại món ăn"}
                        </h2>
                        <div className="mb-4">
                            <label className="block mb-2">Tên loại món ăn<span className="text-red-600">* </span> ({name?.length}/30)</label>
                            <input
                                type="text"
                                placeholder="Tên loại món ăn"
                                value={name}
                                onChange={e => handleChangeCategoryName(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Mô tả <span className="text-red-600">* </span> ({description?.length}/250)</label>
                            <textarea
                                type="text"
                                placeholder="Mô tả"
                                value={description}
                                onChange={e => handleChangeDescription(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            {/* <button
                                onClick={handleCloseCreatePop}
                                className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-red-700 transition-all duration-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={isCreate ? handleSubmitCreateCategory : handleSubmitUpdateCategory}
                                className="py-2 px-5 bg-blue-500 font-semibold text-white rounded hover:bg-blue-700 transition-all duration-300"
                            >
                                {isCreate ? "Thêm" : "Cập nhật"}
                            </button> */}
                            <button
                                type="submit" 
                                onClick={isCreate ? handleSubmitCreateCategory : handleSubmitUpdateCategory}
                                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                                {isCreate ?"Thêm":"Cập nhật"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isOpenDeletePop && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-50 animate-slideIn">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl "
                            onClick={handleCloseDeletePop}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-4">
                            Xác nhận xóa
                        </h2>
                        <p>Bạn có chắc chắn muốn xóa "{name}" không?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={handleCloseDeletePop}
                                className="py-2 px-5 bg-gray-600 font-semibold text-white rounded hover:bg-gray-700 transition-all duration-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDeleteCategory}
                                className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-red-700 transition-all duration-300"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryManagement;
