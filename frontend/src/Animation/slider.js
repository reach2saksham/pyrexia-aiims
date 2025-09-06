import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slider.css"; // Create this file for custom styles
import img1 from "../Images/Gallery/1.avif";
import img2 from "../Images/Gallery/2.avif";
import img3 from "../Images/Gallery/3.avif";
import img4 from "../Images/Gallery/4.avif";
import img5 from "../Images/Gallery/5.avif";
// import img6 from "../Images/Gallery/6.avif";
import img7 from "../Images/Gallery/7.avif";
import img8 from "../Images/Gallery/8.avif";
import img9 from "../Images/Gallery/9.avif";
import img10 from "../Images/Gallery/10.avif";
import img11 from "../Images/Gallery/11.avif";
import img12 from "../Images/Gallery/12.avif";
import img13 from "../Images/Gallery/13.avif";
import img14 from "../Images/Gallery/14.avif";
import img15 from "../Images/Gallery/15.avif";
import img16 from "../Images/Gallery/16.avif";
import img17 from "../Images/Gallery/17.avif";
import img18 from "../Images/Gallery/18.avif";
import img19 from "../Images/Gallery/19.avif";
import img20 from "../Images/Gallery/20.avif";

const Slider1 = () => {
  const images = [
    img1,img2,img3,img4,img8,img5,img7,img9,img10,img11,img12,img13,img14,img15,img16,img17,img18,img19,img20
  ];
  const settings = {    
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1800,
    cssEase: "linear",
  };

  return (
    <div className="image-slider">
      <div className="text-white text-3xl md:text-4xl lg:text-6xl font-semibold font-sant-serif shackleton-text pb-8">GALLERY</div>
      <Slider {...settings}>
        {images.map((image, index) => (
    
          <div key={index}>

            <img src={image} className='w-[80%] md:w-[50%] lg:w-[72%] border rounded-md shadow-xl h-auto'alt={`Slide ${index}`} />
          </div>
        ))}
        
      </Slider>
    </div>
  );
};

export default Slider1;
