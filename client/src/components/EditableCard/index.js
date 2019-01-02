import React from 'react';
import PropTypes from 'prop-types';

import style from './style.scss';
import CardWithoutLink from "../../scenes/AdminManager/CardWithoutLink";


const EditableCard = (props) => (
  <div className='editable-card-wrapper'>
    <a className='edit-card-button' onClick={props.onClick}><img className='edit-image' src='static/edit.svg'/></a>
    <CardWithoutLink {...props} />
  </div>
);

EditableCard.propTypes = {
  description: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string
};

export default EditableCard;

