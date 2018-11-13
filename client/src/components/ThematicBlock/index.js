import React from 'react';
import PropTypes from 'prop-types';

import Card from '../Card';
import EditableCard from '../EditableCard';

import style from './style.scss';


const ThematicBlock = (props) => {
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
      <Card
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

ThematicBlock.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEditInit: PropTypes.func.isRequired,
  admin: PropTypes.bool.isRequired,
  showBorder: PropTypes.bool
};

export default ThematicBlock;