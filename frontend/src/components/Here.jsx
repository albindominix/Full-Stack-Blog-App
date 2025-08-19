import React from 'react';
import heroImg from "../images/hero.gif"
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <>
      <div className="hero flex items-center justify-between px-[100px]" style={{ height: "calc(100vh - 100px)" }}>
        <div className="left w-[50%]">
          <h3 className='text-[60px]' style={{lineHeight:1}}>Unlock the Secrets to <span className='sp-text'>Masterful</span> Programming Here.</h3>
          <div className="flex mt-6 items-center gap-[15px]">
            <Link to="/uploadBlog" className='btnNormal'>Get Started</Link>
            <Link to="/uploadBlog" className='btnWhite'>Learn More</Link>
          </div>
        </div>
        <div className="right w-[50%]">
          <img className='rounded-[20px] w-full' src={heroImg} alt="" />
        </div>
      </div>
    </>
  )
}

export default Hero