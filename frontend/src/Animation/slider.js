import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slider.css"; // Create this file for custom styles
import img1 from "../Images/Gallery/1.JPG";
import img2 from "../Images/Gallery/2.JPG";
import img3 from "../Images/Gallery/3.JPG";
import img4 from "../Images/Gallery/4.JPG";
import img5 from "../Images/Gallery/5.JPG";
// import img6 from "../Images/Gallery/6.JPG";
import img7 from "../Images/Gallery/7.JPG";
import img8 from "../Images/Gallery/8.JPG";
import img9 from "../Images/Gallery/9.JPG";
import img10 from "../Images/Gallery/10.JPG";
import img11 from "../Images/Gallery/11.JPG";
import img12 from "../Images/Gallery/12.JPG";
import img13 from "../Images/Gallery/13.JPG";
import img14 from "../Images/Gallery/14.JPG";
import img15 from "../Images/Gallery/15.JPG";
import img16 from "../Images/Gallery/16.JPG";
import img17 from "../Images/Gallery/17.JPG";
import img18 from "../Images/Gallery/18.JPG";
import img19 from "../Images/Gallery/19.JPG";
import img20 from "../Images/Gallery/20.JPG";

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
