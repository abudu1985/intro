import React from 'react';
import PropTypes from 'prop-types';

import AnimateCard from '../AnimateCard';
import EditableCard from '../../EditableCard';

import style from './style.scss';


const AnimateThematicBlock = (props) => {
  let cards = [];
  if (props.admin && !props.showBorder) {
    cards = props.cards.map((card) => 
      <EditableCard
        title={card.title}
        description={card.description}
        pic={card.pic}
        url={card.url}
        onClick={() => props.onEditInit(card.id)}
        key={card.id+card.title}/>
    );
  } else {
    cards = props.cards.map((card) => 
      <AnimateCard
        title={card.title}
        description={card.description}
        pic={card.pic}
        url={card.url}
        key={card.id+card.title}/>
    );
  }
  return (
    <div className={props.showBorder ? 'thematic-block-showBorder' : 'thematic-block'}>
      <h2>{props.blockName}</h2>
      <div className='cards-list'>{cards}</div>
    </div>
  );
};

AnimateThematicBlock.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEditInit: PropTypes.func.isRequired,
  admin: PropTypes.bool.isRequired,
  showBorder: PropTypes.bool
};

export default AnimateThematicBlock;