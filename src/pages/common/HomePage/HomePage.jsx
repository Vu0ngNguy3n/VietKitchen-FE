import NavBar from "../../../components/component/NavBar/NavBar"
import banner from '../../../assests/restaurant-seo.svg'
import Banner from "../../../components/component/Banner/Banner"
import Feature from "../../../components/component/Features/Feature"
import About from "../../../components/component/About/About"
import Pricing from "../../../components/component/Pricing/Pricing"


function HomePage() {
    return (
        <>
            <NavBar />
            <div className="md:px-12 p-4 max-w-screen-2xl mx-auto mt-20">
                <Banner 
                    banner={banner}
                    heading={"Develop your skills withou deligence."} 
                    subheading={"A good example of a paragraph contain a topic sentence, details and a conclusion. "}
                    btn1={"Get Started"}
                    btn2={"Discount"}   
                />
            </div>
            <Feature/>
            <About/>
            <Pricing/>
        </>
    )
}

export default HomePage