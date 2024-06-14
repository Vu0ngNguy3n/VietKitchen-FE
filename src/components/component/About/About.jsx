import about from '../../../assests/About1.svg'
import about1 from '../../../assests/about2.svg'

const About = () => {
    return (
        <div className="md:px-14 p-4 max-w-s mx-auto space-y-8">
            <div className='flex flex-col md:flex-row justify-between items-center gap-8'>
                <div className='md:w-1/2'>
                    <img src={about} alt="" />
                </div>

                <div className='md:w-2/5'>
                    <h2 className='md:text-5xl text-3xl font-bold text-primary mb-5 leading-normal'>We have been improving our product <span className='text-secondary'>for many years.</span></h2>
                    <p className='text-tartiary text-lg mb-7'>A good example of a paragraph contains a topic conclusion</p>
                    <button className='btnHome'>Get Started</button>
                </div>
            </div>

           

            <div className='flex flex-col md:flex-row-reverse justify-between items-center gap-8'>
                <div className='md:w-1/2'>
                    <img src={about1} alt="" />
                </div>

                <div className='md:w-2/5'>
                    <h2 className='md:text-5xl text-3xl font-bold text-primary mb-5 leading-normal'>We have been improving our <span className='text-secondary'> product for many years.</span></h2>
                    <p className='text-tartiary text-lg mb-7'>A good example of a paragraph contains a topic conclusion</p>
                    <button className='btnHome'>Get Started</button>
                </div>
            </div>
        </div>
    )
}

export default About