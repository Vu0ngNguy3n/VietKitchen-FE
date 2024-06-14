import NavBar from "../../../components/component/NavBar/NavBar"
import banner from '../../../assests/restaurant-seo.svg'
import Banner from "../../../components/component/Banner/Banner"
import Feature from "../../../components/component/Features/Feature"
import About from "../../../components/component/About/About"
import Pricing from "../../../components/component/Pricing/Pricing"
import Newsletter from "../../../components/component/Newsletter/Newsletter"
import Footer from "../../../components/component/Footer/Footer"


function HomePage() {
    return (
        <>
            <NavBar />
            <div className="md:px-12 p-4 max-w-screen-2xl mx-auto mt-20" id="home">
                <Banner 
                    banner={banner}
                    heading={"Dịch vụ quản lý và bán hàng đa kênh"} 
                    subheading={"Chuyên cung cấp các giải pháp quản lý nhà hàng, VietKitchen mang đến trải nghiệm tuyệt vời giành cho khách hàng. "}
                    btn1={"Khám phá ngay"}
                    btn2={"Đăng nhập"}   
                />
            </div>
            <Feature/>
            <About/>
            <Pricing/>
            <Newsletter/>
            <Footer/>
        </>
    )
}

export default HomePage