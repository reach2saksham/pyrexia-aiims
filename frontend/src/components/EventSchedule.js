import React from 'react'
import { Link } from 'react-router-dom'

const EventSchedule = () => {
    return (
        <div className='flex flex-col items-center justify-center gap-20 bg-opacity-20 backdrop-blur-0 rounded-[2rem] lg:w-[70%] w-[90%] h-[80vh] m-auto mb-24 z-[1999999]'>
            <h3 data-aos="fade-up" className='text-center font-bold text-3xl md:text-6xl pt-20 text-pink-600 shackleton-text'>EVENT SCHEDULE</h3>
            <p className='text-2xl font-medium text-center text-white'>
                Schedule will be released soon....
            </p>
        </div>
    )
}

export default EventSchedule