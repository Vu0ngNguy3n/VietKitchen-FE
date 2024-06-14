import Banner from "../Banner/Banner"
import bannerSvg from "../../../assests/restaurant-seo.svg"

const Newsletter = () => {
    return (
        <div className="md:px-14 p-4 max-w-screen-2xl mx-auto my-12">
            <Banner 
                banner={bannerSvg} 
                heading={"VietKitchen -  Tất cả những gì bạn cần để quản lý và kinh doanh"}
                subheading={"Nhanh tay đăng ký để nhận 7 ngày dùng thử miễn phí."}
                btn1={"Dùng thử"}
                btn2={''}
            />
        </div>
    )
}

export default Newsletter