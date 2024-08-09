import Dashboardview from "../../components/adminComponent/DashboardView"
import Sidebar from "../../components/adminComponent/Sidebar"
import { FaEllipsisV, FaRegCalendarMinus } from "react-icons/fa"
import { BiExport } from "react-icons/bi";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import {  useUser } from "../../utils/constant";
import {formatVND} from "../../utils/format"
import { toast } from "react-toastify";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


function Dashboard() {

     const [dataStatistic, setDataStatistic] = useState();
    const [typeMonth, setTypeMonth] = useState('current-week')
    const [dataStatisticAll, setDataStatisticAll] = useState([]);
    const [revenueTotal, setRevenueTotal] = useState();
    const [restaurantTotal, setRestaurantTotal] = useState();
    const [listTime, setListTime] = useState([])
    const [statisticRevenue, setStatisticRevenue] = useState([]);
    const [statisticRestaurant, setStatisticRestaurant] = useState([]);
    const user = useUser();

    useEffect(() => {
        axiosInstance
        .get(`/api/statistic/admin/time/${typeMonth}`)
        .then(res => {
            const data = res.data.result;
            setDataStatisticAll(data);            
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
    },[typeMonth])

    useEffect(() => {
        const times = [];
        let revenue = 0;
        const revenueList = []; 
        const restaurants = [];
        let totalRes = 0;
        dataStatisticAll?.map((data) => {
            times.push(data?.day);
            revenueList.push(data?.total);
            revenue+=data?.total
            restaurants.push(data?.totalRestaurant);
            totalRes+=data?.totalRestaurant;
        })
        setRevenueTotal(revenue);
        setStatisticRevenue(revenueList);
        setListTime(times);
        setStatisticRestaurant(restaurants);
        setRestaurantTotal(totalRes);
    },[dataStatisticAll])


    const earning = {
       chart: {
            type: 'line'
        },
        title: {
            text: `Thống kê doanh thu theo ${typeMonth.includes("week") ? "tuần" : "tháng" } `
        },
        subtitle: {
            text: 'Source: ' +
                '<a target="_blank">VIETKITCHEN</a>'
        },
        xAxis: {
            categories: listTime
        },
        yAxis: {
            title: {
                text: 'VNĐ'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: 'Doanh số',
            data: statisticRevenue
        }]
    };

    const newRestaurants = {
       chart: {
            type: 'line'
        },
        title: {
            text: `Thống kê số nhà hàng mới theo ${typeMonth.includes("week") ? "tuần" : "tháng" } `
        },
        subtitle: {
            text: 'Source: ' +
                '<a target="_blank">VIETKITCHEN</a>'
        },
        xAxis: {
            categories: listTime
        },
        yAxis: {
            title: {
                text: 'VNĐ'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: 'Nhà hàng',
            data: statisticRestaurant
        }]
    };




   

    // const handleExport = () => {
    //     // console.log(allDataLineChart);        
    //     const ws = XLSX.utils.json_to_sheet(allDataLineChart);
    //      const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    //     const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    //     saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'data.xlsx');

    // }

    return (
        <div className="">
            <div className="flex">
                <div className="basis-[12%] h-[100vh]">
                    <Sidebar />
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <Dashboardview />
                    <div>
                        <div className='px-[25px] pt-[25px] bg-[#F8F9FC] pb-[40px]'>
                            <div className='flex items-center justify-between'>
                                <h1 className='text-[28px] leading-[34px] font-normal text-[#5a5c69] cursor-pointer'>Dashboard</h1>

                                <button 
                                    className='bg-[#2E59D9] h-[32px] rounded-[3px] text-white flex items-center justify-center px-4 py-2 transition-all duration-300 shadow-md hover:translate-x-2 hover:bg-blue-600'>
                                    <BiExport className="mr-2"/>Xuất dữ liệu
                                </button>
                            </div>
                            <div className='grid grid-cols-4 gap-[30px] mt-[25px] pb-[15px]'>
                                <div className=' h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#4E73DF] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                                    <div>
                                        <h2 className='text-[#B589DF] text-[11px] leading-[17px] font-bold uppercase'>Doanh thu</h2>
                                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{formatVND(revenueTotal)}</h1>
                                    </div>
                                    <FaRegCalendarMinus fontSize={28} color="" />

                                </div>
                                <div className=' h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#1CC88A] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                                    <div>
                                        <h2 className='text-[#1cc88a] text-[11px] leading-[17px] font-bold uppercase'>
                                            Tổng hoá đơn</h2>
                                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'><span className="text-[#1cc88a]">{dataStatistic?.numbersBill}</span> hoá đơn</h1>
                                    </div>
                                    <FaRegCalendarMinus fontSize={28} />
                                </div>
                                <div className=' h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#36B9CC] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                                    <div>
                                        <h2 className='text-[#1cc88a] text-[11px] leading-[17px] font-bold uppercase'>Số khách hàng mới</h2>
                                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{restaurantTotal} nhà hàng</h1>
                                    </div>
                                    <FaRegCalendarMinus fontSize={28} />
                                </div>
                                <div className=' h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#F6C23E] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                                    <div>
                                        <h2 className='text-[#1cc88a] text-[11px] leading-[17px] font-bold uppercase'>Tổng số gói</h2>
                                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{formatVND(dataStatistic?.vat)}</h1>
                                    </div>
                                    <FaRegCalendarMinus fontSize={28} />
                                </div>

                            </div>
                            <div className='flex-row mt-[22px] w-full gap-[30px]'>
                                <div className="flex row justify-start my-2 w-[20%]">
                                    <form className="max-w-sm ">
                                        <label for="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Chọn khoảng thời gian</label>
                                        <select 
                                            id="countries"
                                            onChange={(e) => setTypeMonth(e.target.value)} 
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                            <option value="current-week">Tuần này</option>
                                            <option value="last-week">Tuần trước</option>
                                            <option value="current-month">Tháng này</option>
                                            <option value="last-month">Tháng trước</option>
                                        </select>
                                    </form>
                                </div>
                                <div className='basis-[100%] border bg-white shadow-md cursor-pointer rounded-[4px]'>
                                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED]'>
                                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'>Thống kê doanh thu theo {typeMonth?.includes("month") ? "tháng" : "tuần"}</h2>
                                        <FaEllipsisV color="gray" className='cursor-pointer' />
                                    </div>
                                    <div className='px-[25px] space-y-[15px] py-[15px]'>
                                        <HighchartsReact highcharts={Highcharts} options={earning}/>                                       
                                    </div>
                                </div>
                                <div className='basis-[100%] border bg-white shadow-md cursor-pointer rounded-[4px]'>
                                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED]'>
                                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'>Thống kê khách hàng mới theo {typeMonth?.includes("month") ? "tháng" : "tuần"}</h2>
                                        <FaEllipsisV color="gray" className='cursor-pointer' />
                                    </div>
                                    <div className='px-[25px] space-y-[15px] py-[15px]'>
                                        <HighchartsReact highcharts={Highcharts} options={newRestaurants}/>                                       
                                    </div>
                                </div>
                            </div>
                            <div className='flex-row mt-[22px] w-full gap-[30px]'>
                                
                                <div className="w-full flex gap-[10px]">
                                    <div className='basis-[49%] border bg-white shadow-md cursor-pointer rounded-[4px]'>
                                        <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED] mb-[20px]'>
                                            <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'>Thống kê doanh thu</h2>
                                            <FaEllipsisV color="gray" className='cursor-pointer' />
                                        </div>

                                        <div className="w-full">
                                            <HighchartsReact highcharts={Highcharts} />
                                        </div>

                                    </div>
                                    <div className='basis-[49%] border bg-white shadow-md cursor-pointer rounded-[4px]'>
                                        <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED]'>
                                            <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'>Thống kê số lượng hoá đơn</h2>
                                            <FaEllipsisV color="gray" className='cursor-pointer' />
                                        </div>
                                        <div className='w-full'>
                                            <HighchartsReact highcharts={Highcharts}/>                                       
                                        </div>
                                    </div>
                                </div>
                            </div>
                            


                        </div >
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Dashboard