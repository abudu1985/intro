import React from 'react';
import PropTypes from 'prop-types';

import IconImage from '../../IconImage';

import style from './style.scss';


const Card = (props) => (
  <a className='card_animated' href={props.url} target='_blank'>
      <div className="upper">
        <div className="title">
          {props.title}
        </div>
        <div className='image'>
          {props.pic ? <img className='image' src={props.pic}/> : null}
        </div>
      </div>
      <div className='bottom'>
          {props.description}
      </div>
  </a>
);

Card.propTypes = {
  description: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string
};

export default Card;

