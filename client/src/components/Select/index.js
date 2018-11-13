import React from 'react';

import style from './style.scss';


export default props => (
  <select className="cgnintro-select" {...props}>
    {props.children}
  </select>
);