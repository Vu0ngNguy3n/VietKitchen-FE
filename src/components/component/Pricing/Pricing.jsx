import { useState } from "react"
import greenPoint from "../../../assests/green.png"
import xmarkIcon from "../../../assests/xmark.png"
import { motion } from "framer-motion"
import { fadeIn } from '../../../variants'

const Pricing = () => {

    const [isYearly, setIsYearly] = useState(false);
    const packages = [
        { name: "Trial", monthlyPrice: 0, yearlyPrice: 0, description: "Dành cho nhà hàng muốn khám phá và trải nghiệm nền tảng quản lý hiệu quả với các tính năng cơ bản trong vòng 1 tuần. ", green: greenPoint, red: xmarkIcon },
        { name: "Standard", monthlyPrice: 199000, yearlyPrice: 149000, description: "Lựa chọn phổ biến cho các nhà hàng vừa và nhỏ, bao gồm các tính năng nâng cao để tối ưu hóa hoạt động hàng ngày. ", green: greenPoint, red: xmarkIcon },
        { name: "Premium", monthlyPrice: 549000, yearlyPrice: 449000, description: "Đáp ứng nhu cầu của các nhà hàng lớn, cung cấp các tính năng cao cấp và hỗ trợ khách hàng chuyên nghiệp. ", green: greenPoint, red: xmarkIcon },
    ]

    return (
        <div className="md:px-14 p-4 max-w-s mx-auto py-10" id="pricing">
            <div className="text-center">
                <h2 className="md:text-5xl text-3xl font-extrabold text-primary mb-2">Bảng Giá Dịch Vụ</h2>
                <p className="text-tartiary md:w-1/3 mx-auto px-2">Các gói dịch vụ linh hoạt và phù hợp với mọi quy mô nhà hàng.</p>

                {/* <div className="mt-16">
                    <label htmlFor="toggle" className="inline-flex items-center cursor-pointer ">
                        <span className={`mr-8 text-2xl font-semibold transition duration-200 ease-in-out ${isYearly ? "" : "text-secondary"}`}>Monthly</span>
                        <div className="w-14 h-6 bg-gray-300 rounded-full transition duration-200 ease-in-out ">
                            <div className={`w-6 h-6 rounded-full transition duration-200 ease-in-out   ${isYearly ? "bg-primary ml-8 " : "bg-gray-500"}`}></div>
                        </div>
                        <span className={`ml-8 text-2xl font-semibold transition duration-200 ease-in-out ${isYearly ? "text-secondary" : ""}`}>Yearly</span>
                    </label>
                    <input
                        type="checkbox"
                        id="toggle" className="hidden"
                        checked={isYearly}
                        onChange={() => {
                            setIsYearly(!isYearly)
                        }}
                    />
                </div> */}
            </div>

            <motion.div
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: false, amount: 0.7 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-20 md:w-11/12 mx-auto">
                {packages.map((pkg, index) => <div key={index} className="border py-10 md:px-6 px-4 rounded-lg shadow-3xl">
                    <h3 className="text-3xl font-bold text-center text-primary">{pkg.name}</h3>
                    <p className="text-tartiary text-center my-5">{pkg.description}</p>
                    <p className={`mt-5 text-center text-black text-2xl font-bold ${pkg.monthlyPrice === 0 ? 'opacity-0' : 'opacity-100'}`} style={{ textDecoration: 'line-through' }}>
                        {pkg.monthlyPrice?.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        })}
                        <span className="text-base text-tartiary font-medium">/tháng</span>
                    </p>
                    <p className="mt-5 text-center text-secondary text-4xl font-bold">
                        {pkg.yearlyPrice?.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        })}
                        <span className="text-base text-tartiary font-medium">/tháng</span>
                    </p>
                    <ul className="mt-4 space-y-2 px-4">
                        <li className="flex gap-2 items-center"><img src={`${pkg.monthlyPrice === 50 ? `${pkg?.green}` : `${pkg?.red}`}`} alt="" className="w-4 h-4" />{pkg.monthlyPrice === 50 ? "Không giới hạn khu vực " : "Giới hạn tạo 1 khu vực bàn"}</li>
                        <li className="flex gap-2 items-center"><img src={`${pkg.monthlyPrice === 50 ? `${pkg?.green}` : `${pkg?.red}`}`} alt="" className="w-4 h-4" />{pkg.monthlyPrice === 50 ? "Không giới hạn chỗ ngồi" : "Tối đa 100 chỗ ngồi"}</li>
                        <li className="flex gap-2 items-center"><img src={pkg?.green} alt="" className="w-4 h-4" />Trạng thái món ăn theo thời gian thực</li>
                        <li className="flex gap-2 items-center"><img src={pkg?.green} alt="" className="w-4 h-4" />Tự chọn món ăn dễ dàng và tiện lợi </li>
                        <li className="flex gap-2 items-center"><img src={pkg?.green} alt="" className="w-4 h-4" />Chủ nhà hàng tự do cấu trúc lại bố trí bàn ăn của nhà hàng theo ý muốn.</li>
                        {/* <li className="flex gap-2 items-center"><img src={`${pkg.monthlyPrice === 0 ? `${pkg?.red}` : `${pkg?.green}`}`} alt="" className="w-4 h-4" />Video of Lessons</li> */}
                    </ul>

                    <div className="w-full mx-auto mt-8 flex items-center justify-center">
                        <button className="btnHome">Đăng ký ngay</button>
                    </div>
                </div>)}
            </motion.div>

        </div>
    )
}

export default Pricing