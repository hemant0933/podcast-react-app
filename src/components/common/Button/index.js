import React from 'react';
import './style.css';

const Button = ({text, onClick, disable, width}) => {
  return (
    <div onClick={onClick} className='custom-btn' disable={disable} style={{width:width}}>
      {text}
    </div>
  );
}

export default Button;
