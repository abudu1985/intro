import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RoundButton from '../RoundButton'

import style from './style.scss';


export default props => (
  <div className='admin-bar-block'>
    <div className='content-wrapper'>
      <div className='admin-bar'>
        <p>
          You can create, edit and delete cards.
          Use power for good and not evil.
        </p>
        <RoundButton innerHtml='Create New Card' onClick={props.initEditing}/>
      </div>
    </div>
  </div>
);