import SidebarManager from "../../components/managerComponent/SidebarManager"
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard"
import { FaEllipsisV, FaRegCalendarMinus } from "react-icons/fa"
import { Progress } from "antd"
import { BiExport } from "react-icons/bi";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import { getUser } from "../../utils/constant";
import {formatVND} from "../../utils/format"
import { toast } from "react-toastify";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function DashboardManager() {

    const [dataStatistic, setDataStatistic] = useState();
    const [typeMonth, setTypeMonth] = useState('current-month')
    const [allDataLineChart, setAllDataLineChart] = useState();
    const [statisticProfitPerMonth, setStatisticProfitPerMonth] = useState([]);
    const [statisticTimePerMonth, setStatisticTimePerMonth] = useState([]);
    const [statisticBillsPerMonth, setStatisticBillsPerMonth] = useState([]);
    const user = getUser();


    useEffect(()=>{
        axiosInstance
        .get(`/api/statistic/manager/restaurant/${user?.restaurantId}/${typeMonth}`)
        .then(res => {
            const data = res.data.result;
            setDataStatistic(data);
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

        axiosInstance
        .get(`/api/statistic/manager/restaurant/${user?.restaurantId}/${typeMonth}/table`)
        .then(res => {
            const data = res.data.result;
            setAllDataLineChart(data);
            console.log(data);
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

    const earning = {
       chart: {
            type: 'line'
        },
        title: {
            text: 'Thống kê doanh thu theo tháng'
        },
        subtitle: {
            text: 'Source: ' +
                '<a target="_blank">VIETKITCHEN</a>'
        },
        xAxis: {
            categories: statisticTimePerMonth
        },
        yAxis: {
            title: {
                text: 'VNĐ (Ngàn đồng)'
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
            data: statisticProfitPerMonth
        }]
    };

    const billsChart = {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Thống kê số lượng hoá đơn trong tháng'
        },
        subtitle: {
            text: 'Source: ' +
                '<a target="_blank">VIETKITCHEN</a>'
        },
        xAxis: {
            categories: statisticTimePerMonth
        },
        yAxis: {
            title: {
                text: 'Hoá đơn'
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
            name: 'Hoá đơn',
            data: statisticBillsPerMonth
        }]
    }

    useEffect(() => {
        if(allDataLineChart ){
            let bills = [];
            let profits = [];
            let times = [];
             allDataLineChart?.map(data => {
                bills.push(data?.numbersBill);
                profits.push(data?.profit);
                times.push(data?.time)
             })
            setStatisticBillsPerMonth(bills);
            setStatisticProfitPerMonth(profits);
            setStatisticTimePerMonth(times);
        }
    },[allDataLineChart])

    const handleExport = () => {
        // console.log(allDataLineChart);        
        const ws = XLSX.utils.json_to_sheet(allDataLineChart);
         const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'data.xlsx');

    }

    
    return (
        <div className="">
            <div className="flex ">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarManager/>
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <HeaderManagerDashboard />
                    <div>
                        <div className='px-[25px] pt-[25px] bg-[#F8F9FC] pb-[40px]'>
                            <div className='flex items-center justify-between'>
                                <h1 className='text-[28px] leading-[34px] font-normal text-[#5a5c69] cursor-pointer'>Dashboard</h1>

                                <button 
                                    onClick={() => handleExport()}
                                    className='bg-[#2E59D9] h-[32px] rounded-[3px] text-white flex items-center justify-center px-4 py-2 transition-all duration-300 shadow-md hover:translate-x-2 hover:bg-blue-600'>
                                    <BiExport className="mr-2"/>Xuất dữ liệu
                                </button>
                            </div>
                            <div className='grid grid-cols-4 gap-[30px] mt-[25px] pb-[15px]'>
                                <div className=' h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#4E73DF] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                                    <div>
                                        <h2 className='text-[#B589DF] text-[11px] leading-[17px] font-bold uppercase'>Doanh thu cả thuế (Tháng)</h2>
                                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{formatVND(dataStatistic?.profit)}</h1>
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
                                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{dataStatistic?.numbersCustomer} khách</h1>
                                    </div>
                                    <FaRegCalendarMinus fontSize={28} />
                                </div>
                                <div className=' h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#F6C23E] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                                    <div>
                                        <h2 className='text-[#1cc88a] text-[11px] leading-[17px] font-bold uppercase'>Tiền thuế (VAT)</h2>
                                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{formatVND(dataStatistic?.vat)}</h1>
                                    </div>
                                    <FaRegCalendarMinus fontSize={28} />
                                </div>

                            </div>
                            <div className='flex mt-[22px] w-full gap-[30px]'>
                                <div className='basis-[50%] border bg-white shadow-md cursor-pointer rounded-[4px]'>
                                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED] mb-[20px]'>
                                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'>Thống kê doanh thu</h2>
                                        <FaEllipsisV color="gray" className='cursor-pointer' />
                                    </div>

                                    <div className="w-full">
                                        <HighchartsReact highcharts={Highcharts} options={earning}/>
                                    </div>

                                </div>
                                <div className='basis-[50%] border bg-white shadow-md cursor-pointer rounded-[4px]'>
                                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED]'>
                                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'>Thống kê số lượng hoá đơn</h2>
                                        <FaEllipsisV color="gray" className='cursor-pointer' />
                                    </div>
                                    <div className='w-full'>
                                        <HighchartsReact highcharts={Highcharts} options={billsChart}/>                                       
                                    </div>
                                </div>
                            </div>
                            <div className='flex mt-[22px] w-full gap-[30px]'>
                                <div className='basis-[30%] border bg-white shadow-md cursor-pointer rounded-[4px]'>
                                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED]'>
                                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'> Resources</h2>
                                        <FaEllipsisV color="gray" className='cursor-pointer' />
                                    </div>
                                    <div className='pl-[35px] flex items-center justify-center h-[100%]'>
                                        <div>
                                        </div>
                                    </div>
                                </div>
                                <div className='basis-[70%] border bg-white shadow-md cursor-pointer rounded-[4px]'>
                                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED]'>
                                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'>Thống kê số lượng hoá đơn</h2>
                                        <FaEllipsisV color="gray" className='cursor-pointer' />
                                    </div>
                                    <div className='px-[25px] space-y-[15px] py-[15px]'>
                                        <HighchartsReact highcharts={Highcharts} options={billsChart}/>                                       
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

export default DashboardManager