import about from '../../../assests/About1.svg'
import about1 from '../../../assests/about2.svg'
import { motion } from "framer-motion"
import { fadeIn } from '../../../variants'
import { useNavigate } from 'react-router'


const About = () => {
    const navigate = useNavigate();

    return (
        <div className="md:px-14 p-4 max-w-s mx-auto space-y-8" id='about'>
            <div className='flex flex-col md:flex-row justify-between items-center gap-8'>
                <motion.div
                    variants={fadeIn("right", 0.2)}
                    initial="hidden"
                    whileInView={"show"}
                    viewport={{ once: false, amount: 0.7 }}
                    className='md:w-1/2'>
                    <img src={about} alt="" />
                </motion.div>

                <motion.div
                    variants={fadeIn("left", 0.2)}
                    initial="hidden"
                    whileInView={"show"}
                    viewport={{ once: false, amount: 0.7 }}
                    className='md:w-2/5'>
                    <h2 className='md:text-5xl text-3xl font-bold text-primary mb-5 leading-normal'>Tối ưu hóa <span className='text-secondary'>quy trình vận hành.</span> </h2>
                    <p className='text-tartiary text-lg mb-7'>Nền tảng quản lý nhà hàng của chúng tôi giúp tối ưu hóa quy trình gọi món, giảm thiểu sai sót và tăng hiệu quả kinh doanh.</p>
                    <button className='btnHome' onClick={() => navigate("/signUp")}>Bắt đầu</button>
                </motion.div>
            </div>

           

            <div className='flex flex-col md:flex-row-reverse justify-between items-center gap-8'>
                <motion.div
                    variants={fadeIn("left", 0.2)}
                    initial="hidden"
                    whileInView={"show"}
                    viewport={{ once: false, amount: 0.7 }}
                    className='md:w-1/2'>
                    <img src={about1} alt="" />
                </motion.div>

                <motion.div
                    variants={fadeIn("right", 0.2)}
                    initial="hidden"
                    whileInView={"show"}
                    viewport={{ once: false, amount: 0.7 }}
                    className='md:w-2/5'>
                    <h2 className='md:text-5xl text-3xl font-bold text-primary mb-5 leading-normal'>Phát triển không ngừng để<span className='text-secondary'>  nâng cao trải nghiệm khách hàng.</span></h2>
                    <p className='text-tartiary text-lg mb-7'>Với giao diện thân thiện và các tính năng hiện đại như tùy chỉnh món ăn và theo dõi trạng thái món ăn theo thời gian thực, khách hàng sẽ có trải nghiệm tiện lợi và nhanh chóng ngay tại quán.</p>
                    <button className='btnHome' onClick={() => navigate("/signUp")}>Bắt đầu</button>
                </motion.div>
            </div>
        </div>
    )
}

export default About