import React, { useState } from 'react';
// import Header from '../components/common/Header/index';
import SignupForm from '../components/SignupComponent/SignupForm.js';
import LoginFrom from '../components/SignupComponent/LoginFrom';
import Lottie from "react-lottie-player";
import signImage from "../Assets/signup_lottie.json";

const Signup = () => {
  
  const [flag, setFlag] =useState(false)

  return (
    <div className='outer_wrapper'>
     {/* <Header/> */}
     <div className='input_Wrapper'>
     <div className='box1'>
     {!flag ? <h1>Signup</h1> : <h1>Login</h1>}
      {!flag ? <SignupForm/> : <LoginFrom/>}
      {!flag ? <p style={{cursor:'pointer'}} onClick={() => setFlag(!flag)}>Click here if you already have an Account.Login.</p> 
        : 
        <p style={{cursor:'pointer'}} onClick={() => setFlag(!flag)}>Don't have an account? Click here to Signup.</p>}
      
     </div>
     <div className='box2'>
       <div className='svg'>
        <div className='text'>
          <h1>Podcast</h1>
        </div>
       <Lottie
          play
          loop
          mode="normal"
          animationData={signImage}
          className="w-full h-full "
        />
       </div>
     </div>
     </div>
    </div>
  ); 
}

export default Signup;
