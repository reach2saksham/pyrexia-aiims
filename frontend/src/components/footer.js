import { Link } from 'react-router-dom'
import { FaYoutube, FaInstagram } from 'react-icons/fa'
import img from "../Images/Logo.png";
import { IoLogoWhatsapp } from 'react-icons/io'
const Footer = ({ onScheduleClick }) => {
    const date = new Date;
    const year = date.getFullYear();
    return (
        <div className="text-sm ">

            <div className="mb-10 w-[90%] grid gap-2 md:gap-4 lg:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 m-[auto] items-start justify-items-center">

                <div data-aos="fade-up" className='mt-10 w-[100%] md:w-[100%] lg:w-[100%] order-1 md:order-1 lg:order-1'>

                    <Link href="/">
                        <img src={img} alt="logo" className='h-20' />
                    </Link>

                    <p className='max-w-[17rem] py-3 text-base text-white'>Follow Pyrexia, AIIMS Rishikesh's annual fest on these social media platforms for updates! </p>
                    <div className='flex gap-3 py-2 '>

                        <a target='_blank' href="https://wa.me/916350270110" className='transition ease-in delay-50 text-green-400 hover:text-green-500 hover:scale-[110%]'>
                            <IoLogoWhatsapp size={30} />
                        </a>
                        <a target='_blank' href="https://youtube.com/@pyrexiaaiimsrishikesh?si=VHQO-FJe5a-o5frS" className='transition ease-in delay-50 text-blue-500 hover:text-red-500 hover:scale-[110%]'>
                            <FaYoutube size={30} />
                        </a>
                        <a target='_blank' href="https://www.instagram.com/pyrexiaaiims?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className='transition ease-in delay-50 text-pink-500 hover:text-pink-600 hover:scale-[110%]'>
                            <FaInstagram size={30} />
                        </a>
                    </div>
                </div>

                <div data-aos="fade-up" className='mt-10 w-[100%] md:w-[100%] lg:w-[100%] order-2 md:order-2 lg:order-2'>
                    <div className='flex items-center justify-start'><h1 className='font-extrabold text-2xl text-red-500 mr-3'>|</h1><h1 className='text-lg font-bold text-red-500'>Useful Links</h1></div>
                    <ul className='mt-4 flex flex-col gap-3 text-base'>
                        <li className='hover:text-red-500 text-white'><Link to="/events">Events</Link></li>
                        <li className='hover:text-red-500 text-white'><Link to="/basic-registration">Basic Registration</Link></li>
                        {/* <li
                            className="hover:text-red-500 text-white cursor-pointer"
                            onClick={onScheduleClick}
                        >
                            Event Schedule
                        </li> */}
                        {/* <li className=' hover:text-red-500 text-white'><Link to="/starnight">Star Night</Link></li> */}
                    </ul>
                </div>

                <div data-aos="fade-up" className='mt-10 w-[100%] md:w-[100%] lg:w-[100%] order-2 md:order-2 lg:order-2'>
                    <div className='flex items-center justify-start'><h1 className='font-extrabold text-2xl text-red-500 mr-3'>|</h1><h1 className='text-lg font-bold text-red-500'>Legals</h1></div>
                    <ul className='mt-4 flex flex-col gap-3 text-base'>
                        <li className='hover:text-red-500 text-white'><Link to="/legals/privacy-policy">Privacy   Policy</Link></li>
                        <li className='hover:text-red-500 text-white'><Link to="/legals/terms-of-service">Terms & Cond.</Link></li>
                        <li className='hover:text-red-500 text-white'><Link to="/legals/code-of-conduct">Code of Conduct</Link></li>
                        <li className='hover:text-red-500 text-white'><Link to="/legals/refund-policy">Refund Policy</Link></li>
                    </ul>
                </div>

                <div data-aos="fade-up" className='mt-10 w-[100%] md:w-[100%] lg:w-[100%] order-3 md:order-3 lg:order-3 text-base'>
                    <div className='flex items-center justify-start'><h1 className='font-extrabold text-2xl text-red-500 mr-3'>|</h1><h1 className='text-lg font-bold text-red-500'>Contact Us</h1></div>
                    <p className='max-w-[16rem] pt-4 text text-white'>AIIMS Rishikesh, Virbhadra Road, Rishikesh · Uttarakhand- 249 203, India</p>
                    <p className='pt-2 text-white' >Contact Details</p>
                    <p className='pt-2 text-white'>Nikhil Jangir: <a href="tel:+919653981765" className='text-red-500 ml-2 font-semibold'>+919653981765</a></p>
                    <p className='pt-2 text-white'>Jayesh: <a href="tel:+917709375254" className='text-red-500 ml-2 font-semibold'>+917709375254</a></p>
                    <p className='pt-2 text-white'>Om Aniket: <a href="tel:+917735059695" className='text-red-500 ml-2 font-semibold'>+917735059695</a></p>
                    <p className='pt-2 text-white'>Somya: <a href="tel:+919214429803" className='text-red-500 ml-2 font-semibold'>+919214429803</a></p>
                    <p className='pt-2 text-white'>Mail : <a href="pyrexia@aiimsrishikesh.edu.in" className='text-red-500 ml-2 font-semibold'>pyrexia@aiimsrishikesh.edu.in</a></p>
                </div>

            </div>

            <div className=" bg-gray-900 h-[1px]"></div>
            <div className="m-[auto] p-7 text-white flex justify-center items-center lg:w-[90%] md:w-[90%] w-[95%] text-base gap-2">
                <p className='lg:text-base text-sm'>
                    © {year} Pyrexia. All Rights Reserved.
                </p>

            </div>
        </div>
    )
}

export default Footer
