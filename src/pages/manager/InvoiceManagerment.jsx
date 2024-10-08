import React, { useState, useEffect } from 'react';
import SidebarManager from "../../components/managerComponent/SidebarManager";
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import {  useUser } from "../../utils/constant";

function InvoiceManagement() {
    const [invoices, setInvoices] = useState([]);
    const [filter, setFilter] = useState('all');
    const [restaurantId, setRestaurantId] = useState(null);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [size, setSize] = useState(10);
    const [selectedBill, setSelectedBill] = useState(null);
    const [billDetails, setBillDetails] = useState([]);
    const [billDetailsPage, setBillDetailsPage] = useState(1);
    const [billDetailsTotalRecords, setBillDetailsTotalRecords] = useState(0);
    const [billDetailsSize, setBillDetailsSize] = useState(5);
    const user =  useUser();

    useEffect(() => {
        setRestaurantId(user?.restaurantId);
    }, []);

    useEffect(() => {
        if (restaurantId) {
            fetchTotalRecords();
            fetchInvoices();
        }
    }, [page, size, filter, restaurantId]);

    const fetchTotalRecords = async () => {
        try {
            const response = await axiosInstance.get(`/api/bill/restaurant/${restaurantId}`);
            setTotalRecords(response.data.result.length);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            toast.error("Có lỗi xảy ra khi lấy dữ liệu tổng số bản ghi.");
        }
    };

    const fetchInvoices = async () => {
        try {
            const response = await axiosInstance.get(`/api/bill/restaurant/${restaurantId}`, {
                params: {
                    page: page > 0 ? page : 1,
                    size: size > 0 ? size : 10
                }
            });

            const data = response.data.result;
            if (filter !== 'all') {
                const filteredData = data.filter(invoice =>
                    (filter === 'cash' && invoice.methodPayment === 'MONEY') ||
                    (filter === 'transfer' && invoice.methodPayment === 'BANKING')
                );
                setInvoices(filteredData);
            } else {
                setInvoices(data);
            }
            console.log(data);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            toast.error("Có lỗi xảy ra khi lấy dữ liệu hóa đơn.");
        }
    };

    const fetchBillDetailsTotalRecords = async (billId) => {
        try {
            const response = await axiosInstance.get(`/api/bill/${billId}`);
            setBillDetailsTotalRecords(response.data.result.length);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            toast.error("Có lỗi xảy ra khi lấy dữ liệu tổng số bản ghi chi tiết hóa đơn.");
        }
    };

    const fetchBillDetails = async (billId, page = 1, size = 5) => {
        try {
            await fetchBillDetailsTotalRecords(billId);
            const response = await axiosInstance.get(`/api/bill/${billId}`, {
                params: {
                    page: page > 0 ? page : 1,
                    size: size > 0 ? size : 5
                }
            });
            setSelectedBill(invoices.find(invoice => invoice.id === billId));
            setBillDetails(response.data.result);
        } catch (error) {
            console.error("Lỗi khi gọi API chi tiết hóa đơn:", error);
            toast.error("Có lỗi xảy ra khi lấy chi tiết hóa đơn.");
        }
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        const totalPages = Math.ceil(totalRecords / size);
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleBillDetailsPageChange = (newPage) => {
        const totalPages = Math.ceil(billDetailsTotalRecords / billDetailsSize);
        if (newPage > 0 && newPage <= totalPages) {
            setBillDetailsPage(newPage);
            fetchBillDetails(selectedBill.id, newPage, billDetailsSize);
        }
    };

    const renderPageNumbers = (totalRecords, page, size, handleChangePage) => {
        const totalPages = Math.ceil(totalRecords / size);
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i <= 5 || i === totalPages) {
                pageNumbers.push(
                    <li key={i}>
                        <a
                            href="#"
                            onClick={() => handleChangePage(i)}
                            className={`flex items-center justify-center px-3 h-8 leading-tight ${i === page ? 'text-blue-600 border border-blue-300 bg-blue-50' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'} dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                        >
                            {i}
                        </a>
                    </li>
                );
            } else if (i === 6) {
                pageNumbers.push(
                    <li key="dots" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300">...</li>
                );
            }
        }
        return pageNumbers;
    };

    const closeModal = () => {
        setSelectedBill(null);
        setBillDetails([]);
    };

    const formatPaymentMethod = (method) => {
        return method === 'MONEY' ? 'Tiền mặt' : 'Chuyển khoản';
    };

    const formatStatus = (status) => {
        return status === 'CONFIRM' ? 'Đã phục vụ' : "Từ chối";
    };

    useEffect(() => {
        console.log(billDetails);
    },[billDetails])

    function formatDateTime(inputDateTime) {
        const date = new Date(inputDateTime);
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const year = date.getFullYear();

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
    
    return (
        <div className="flex h-screen">
            <div className="basis-[12%] bg-gray-100">
                <SidebarManager />
            </div>
            <div className="basis-[88%] flex flex-col overflow-scroll h-[100vh]">
                <HeaderManagerDashboard />
                <div className="p-8 flex-1 overflow-y-auto max-h-screen bg-gray-200">
                    <h1 className="font-black text-3xl mb-4">Quản lý hóa đơn</h1>

                    <div className="flex flex-col md:flex-row justify-between mb-6">
                        <div className="flex items-center mb-4 md:mb-0">
                            <form className="relative">
                                <select
                                    id="filter"
                                    value={filter}
                                    onChange={handleFilterChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                    focus:border-blue-500 block w-full p-2 outline-none cursor-pointer"
                                >
                                    <option value="all">Tất cả hóa đơn</option>
                                    <option value="transfer">Hóa đơn chuyển khoản</option>
                                    <option value="cash">Hóa đơn tiền mặt</option>
                                </select>
                            </form>
                        </div>
                    </div>

                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-6">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 text-center">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Thời gian thanh toán</th>
                                    <th scope="col" className="px-6 py-3">Khu vực</th>
                                    <th scope="col" className="px-6 py-3">Thông tin khách hàng</th>
                                    <th scope="col" className="px-6 py-3">Phương Thức Thanh Toán</th>
                                    <th scope="col" className="px-6 py-3">Tổng số tiền</th>
                                    <th scope="col" className="px-6 py-3">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody >
                                {invoices?.map(invoice => (
                                    <tr key={invoice.id} className='bg-white border-b-2 text-center'>
                                        <td className="px-6 py-4">{formatDateTime(invoice?.dateCreated)}</td>
                                        <td className="px-6 py-4">{invoice.order.tableRestaurant?.name}</td>
                                        <td className="px-6 py-4">{invoice?.order.customer?.name} - {invoice.order.customer?.phoneNumber}</td>
                                        <td className="px-6 py-4">
                                            {formatPaymentMethod(invoice.methodPayment)}
                                        </td>
                                        <td className="px-6 py-4">{invoice?.total}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => fetchBillDetails(invoice.id, 1, billDetailsSize)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Xem
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-center mb-4">
                        <nav aria-label="Page navigation example">
                            <ul className="flex items-center -space-x-px h-8 text-sm">
                                <li>
                                    <a
                                        href="#"
                                        onClick={() => handlePageChange(page - 1)}
                                        className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${page === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                                    >
                                        <span className="sr-only">Previous</span>
                                        <svg
                                            className="w-2.5 h-2.5 rtl:rotate-180"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 6 10"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 1 1 5l4 4"
                                            />
                                        </svg>
                                    </a>
                                </li>
                                {renderPageNumbers(totalRecords, page, size, handlePageChange)}
                                <li>
                                    <a
                                        href="#"
                                        onClick={() => handlePageChange(page + 1)}
                                        className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${page === Math.ceil(totalRecords / size) ? 'cursor-not-allowed opacity-50' : ''}`}
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg
                                            className="w-2.5 h-2.5 rtl:rotate-180"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 6 10"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m1 9 4-4-4-4"
                                            />
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <div className="flex justify-center mt-4">
                        <p className="text-sm text-gray-500">
                            Trang {page} của {Math.ceil(totalRecords / size)}
                        </p>
                    </div>

                    {selectedBill && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-2xl max-h-full overflow-y-auto relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
                            onClick={closeModal}
                        >
                            &times;
                        </button>
                                <h2 className="text-2xl font-bold mb-4">Chi tiết hóa đơn #{selectedBill.id}</h2>
                                <div className="mb-4 border-t border-b border-gray-200">
                                    <h3 className="text-lg font-semibold mt-4 mb-2">Thông tin thanh toán</h3>
                                    <div className="py-2 flex justify-between">
                                        <span className="text-gray-500">Phương thức thanh toán:</span>
                                        <span className="font-semibold">{formatPaymentMethod(selectedBill?.methodPayment)}</span>
                                    </div>
                                    <div className="py-2 flex justify-between">
                                        <span className="text-gray-500">Tổng số tiền:</span>
                                        <span className="font-semibold">{selectedBill?.total}</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold mt-4 mb-2">Thông tin khách hàng</h3>
                                <div className="mb-4 border-t border-b border-gray-200">
                                    <div className="py-2 flex justify-between">
                                        <span className="text-gray-500">Tên khách hàng:</span>
                                        <span className="font-semibold">{selectedBill.order.customer?.name}</span>
                                    </div>
                                    <div className="py-2 flex justify-between">
                                        <span className="text-gray-500">Số điện thoại:</span>
                                        <span className="font-semibold">{selectedBill.order.customer?.phoneNumber}</span>
                                    </div>
                                    <div className="py-2 flex justify-between">
                                        <span className="text-gray-500">Địa chỉ:</span>
                                        <span className="font-semibold">{selectedBill.order.customer?.address}</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold mt-4 mb-2">Thông tin hóa đơn</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr className='text-center'>
                                                <th scope="col" className="px-6 py-3">Tên món</th>
                                                {/* <th scope="col" className="px-6 py-3">Mô tả</th> */}
                                                <th scope="col" className="px-6 py-3">Giá</th>
                                                <th scope="col" className="px-6 py-3">Số lượng</th>
                                                <th scope="col" className="px-6 py-3">Trạng thái</th>
                                                <th scope="col" className="px-6 py-3">Hình ảnh</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {billDetails?.map(detail => (
                                                <tr key={detail.id} className="bg-white border-b hover:bg-gray-50 text-center">
                                                    <td className="px-6 py-4 font-medium text-gray-900">{detail.dish?.name ||detail?.combo?.name}</td>
                                                    {/* <td className="px-6 py-4">{detail.dish?.description}</td> */}
                                                    <td className="px-6 py-4">{detail?.dish?.price||detail?.combo?.price}</td>
                                                    <td className="px-6 py-4">{detail?.quantity}</td>
                                                    <td className={`px-6 py-4 ${detail?.status === 'CONFIRM' ? "text-green" : "text-red-500"} `} >{formatStatus(detail?.status)}</td>
                                                    <td className="px-6 py-4">
                                                        <img src={detail?.dish?.imageUrl || detail?.combo?.imageUrl} alt={detail.dish?.name} className="w-16 h-16 object-cover" />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex justify-center mt-4">
                                    <nav aria-label="Page navigation example">
                                        <ul className="flex items-center -space-x-px h-8 text-sm">
                                            <li>
                                                <a
                                                    href="#"
                                                    onClick={() => handleBillDetailsPageChange(billDetailsPage - 1)}
                                                    className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${billDetailsPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                                                >
                                                    <span className="sr-only">Previous</span>
                                                    <svg
                                                        className="w-2.5 h-2.5 rtl:rotate-180"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 6 10"
                                                    >
                                                        <path
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M5 1 1 5l4 4"
                                                        />
                                                    </svg>
                                                </a>
                                            </li>
                                            {renderPageNumbers(billDetailsTotalRecords, billDetailsPage, billDetailsSize, handleBillDetailsPageChange)}
                                            <li>
                                                <a
                                                    href="#"
                                                    onClick={() => handleBillDetailsPageChange(billDetailsPage + 1)}
                                                    className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${billDetailsPage === Math.ceil(billDetailsTotalRecords / billDetailsSize) ? 'cursor-not-allowed opacity-50' : ''}`}
                                                >
                                                    <span className="sr-only">Next</span>
                                                    <svg
                                                        className="w-2.5 h-2.5 rtl:rotate-180"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 6 10"
                                                    >
                                                        <path
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="m1 9 4-4-4-4"
                                                        />
                                                    </svg>
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                                <button onClick={closeModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Đóng</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InvoiceManagement;
