import React from 'react'
import { Link } from 'react-router-dom'

const EventSchedule = () => {
    return (
        <div className='flex flex-col items-center justify-center gap-20 bg-opacity-20 backdrop-blur-0 rounded-[2rem] mt-24 lg:w-[70%] w-[90%] m-auto mb-24 z-[1999999]'>
            <h3 
                data-aos="fade-up" 
                className='text-center font-bold text-3xl md:text-6xl pt-20 text-pink-600 shackleton-text'
            >
                EVENT SCHEDULE
            </h3>

            <Link to="https://drive.google.com/drive/folders/1EObqQzYYEZee57SCUkTcB5QXq-ElW9Bi">
                <button
                    className='relative px-8 py-4 my-24 text-lg font-semibold text-white rounded-xl 
                               bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500
                               shadow-lg shadow-pink-500/40
                               transition-all duration-300 ease-out
                               hover:scale-110 hover:shadow-2xl hover:shadow-yellow-500/50
                               hover:from-yellow-500 hover:to-pink-500
                               active:scale-95'
                >
                    ✨ Click Here to See the Event Schedule ✨
                    <span className="absolute inset-0 rounded-xl animate-pulse bg-white/10"></span>
                </button>
            </Link>
        </div>
    )
}

export default EventSchedule
