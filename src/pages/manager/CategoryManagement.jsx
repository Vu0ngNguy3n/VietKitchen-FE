import React, { useEffect, useState } from 'react';
import SidebarManager from "../../components/managerComponent/SidebarManager";
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard";
import { IoMdAdd } from "react-icons/io";
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';

function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [isOpenCreatePop, setIsOpenCreatePop] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isCreate, setIsCreate] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const accountId = user?.accountId;

        axiosInstance.get(`/api/dish-category/${accountId}`)
            .then(res => {
                if (res.data.code === 200) {
                    setCategories(res.data.result);
                } else {
                    toast.error("Failed to fetch categories");
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
    }, []);

    const handleOpenCreatePop = () => {
        setIsOpenCreatePop(true);
        setIsCreate(true);
        setName('');
        setDescription('');
    };

    const handleCloseCreatePop = () => {
        setIsOpenCreatePop(false);
    };

    const handleSubmitCreateCategory = () => {
        if (name.trim() === '' || description.trim() === '') {
            toast.warn("Vui lòng không được bỏ trống thông tin món ăn");
        } else {
            const user = JSON.parse(localStorage.getItem('user'));
            const accountId = user?.accountId;

            const category = {
                name: name,
                description: description,
                accountId: accountId
            };

            axiosInstance
                .post('/api/dish-category/create', category)
                .then(res => {
                    if (res.data.code === 200) {
                        toast.success("Thêm thực đơn thành công");
                        setCategories([...categories, res.data.result]);
                        handleCloseCreatePop();
                    } else {
                        toast.error("Failed to create category");
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

    return (
        <div className="">
            <div className="flex">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarManager />
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <HeaderManagerDashboard />
                    <div className="min-w-[40]x rounded-lg bg-white p-16 shadow min-h-[90vh] mt-2">
                        <div className="flex justify-between">
                            <h1 className="font-black text-3xl">Quản lý thực đơn</h1>
                            <button
                                className="py-2 px-3 bg-lgreen font-semibold text-white rounded hover:bg-green transition-all duration-300 flex items-center"
                                onClick={handleOpenCreatePop}
                            >
                                <IoMdAdd />Thêm thực đơn
                            </button>
                        </div>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Tên món ăn
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Mô tả
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories?.map((category) => (
                                        <tr key={category.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <td className="px-6 py-4">
                                                {category.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {category.description}
                                            </td>
                                            <td className="px-6 py-4">
                                                <a href="#" className="font-medium text-red-600 dark:text-red-500 hover:underline">Remove</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
                            Thêm thực đơn
                        </h2>
                        <div className="mb-4">
                            <label className="block mb-2">Tên món ăn</label>
                            <input
                                type="text"
                                placeholder="Tên món ăn"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Mô tả</label>
                            <input
                                type="text"
                                placeholder="Mô tả"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleCloseCreatePop}
                                className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-red-700 transition-all duration-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSubmitCreateCategory}
                                className="py-2 px-5 bg-lgreen font-semibold text-white rounded hover:bg-green transition-all duration-300"
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default CategoryManagement;
