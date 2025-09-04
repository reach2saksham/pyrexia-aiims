import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import TopImageAnimation from '../Animation/TopImageAnimation';
import { Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import Alfresco from '../Logos/Alfresco.png';
import Kalakriti from '../Logos/Kalakriti .png';
import LITtMania from '../Logos/Littmania.png';
import Sinfonia from '../Logos/Sinfonia.png';
import Velocity from '../Logos/Velocity.png';
import Thunderbolt from '../Logos/ThunderBolts.webp';
import Chorea from '../Logos/CHOREA.png';
import Thespians from '../Logos/Thespians.png';
import Chronos from '../Logos/Chorons.png';
import majoreventsImg from "../Image/major-events.png";
import redstamp from "../Images/redstamp.png";
import eventcardbg from "../Images/eventcardbg.png";

const images = [
  { src: Alfresco, title: 'Alfresco', events: 'Alfresco' },
  { src: Chorea, title: 'Chorea', events: 'Chorea' },
  { src: Kalakriti, title: 'Kalakriti', events: 'Kalakriti' },
  { src: Chronos, title: 'Chronos', events: 'Chronos' },
  { src: LITtMania, title: 'LITtMania', events: 'LITtMania' },
  { src: Sinfonia, title: 'Sinfonia', events: 'Sinfonia' },
  { src: Thespians, title: 'Thespians', events: 'Thespians' },
  { src: Thunderbolt, title: 'Thunderbolt', events: 'Thunderbolt' },
  { src: Velocity, title: 'Velocity', events: 'Velocity' },
];

const HomeEvent = () => {
  const navigate = useNavigate();

  const handleImageClick = (events) => {
    navigate("/events", { state: { events } });
  };

  return (
    <section className="max-w-screen-xl mx-auto py-10">
      <div className='flex justify-center items-center'>
        <img
          src={majoreventsImg}
          alt="Event Registration"
          className="w-80 mb-4"
        />
      </div>
      <Swiper
        modules={[Navigation]}
        spaceBetween={0}
        navigation
        loop
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="mySwiper justify-center text-center items-center"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
              <div className=" z-10 flex justify-center -mb-8">
                <img src={redstamp} alt="Red Stamp" className="w-20 z-10" />
              </div>
            <div className="relative flex flex-col justify-center items-center w-full  cursor-grab transition-transform duration-100 hover:scale-105">
              {/* Stamp on top of background */}
              
              {/* Background image */}
              <img
                src={eventcardbg}
                alt="Event Card Background"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[360px] md:w-[400px] h-auto z-0"
              />


              {/* Card Content */}
              <div
                className="relative z-20 flex flex-col items-center w-full md:max-w-[350px] rounded-lg p-6"
                onClick={() => handleImageClick(image.events)}
              >
                <h2 className="shackleton-text text-center text-white font-bold text-xl md:text-4xl my-4">
                  {image.title}
                </h2>

                <TopImageAnimation
                  imgSrc={image.src}
                  imgAlt={image.title}
                  imgClasses="w-full h-[250px] md:h-[280px] object-cover drop-shadow-[0_0px_80px_rgba(59,130,246,0.7)]"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HomeEvent;
