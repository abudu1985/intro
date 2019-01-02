import React from 'react';

import style from './style.scss';


const Logo = () => (
  <div className='logo-container'>
    <img className={window.innerWidth > 776 ? 'logo' : 'logo-mobile'} src={window.innerWidth > 776 ? 'static/logo.svg' : 'static/logo-cogniance.png'} />
    {/*<span className='logo-text'>Index</span>*/}
  </div>
);

export default Logo;