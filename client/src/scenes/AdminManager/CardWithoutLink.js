import React from 'react';
import PropTypes from 'prop-types';

import style from './style.scss';


const CardWithoutLink = (props) => (
    <div className='card'>
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
    </div>
);

CardWithoutLink.propTypes = {
    description: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string
};

export default CardWithoutLink;

