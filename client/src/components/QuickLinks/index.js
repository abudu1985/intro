import React from 'react';
import { connect } from 'react-redux';

import IconImage from '../IconImage';

import style from './style.scss';


const mapStateToProps = (state) => {
  return {showQuickLinks: state.additions.showQuickLinks, cards: state.cards};
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (event) => {
      dispatch(searchFilter(event.target.value))
    }
  }
}


function QuickCard(props) {
  return (
    <a className='quick-card' href={props.card.url} target='_blank'>
      <IconImage src={props.card.pic} />
      <span>{props.card.title}</span>
    </a>
  )
}


function RawQuickLinks(props) {
  let cards = props.cards.concat().sort((a, b) => {
    return b.rating - a.rating ? b.rating - a.rating : b.title > a.title;
  });
  if (cards.length > 5) {
    cards = cards.slice(0, 5);
  }
  cards = cards.map((card) => {
    return (
      <QuickCard card={card} key={card.id}/>
    );
  });
  if (!props.showQuickLinks) {
    return null;
  }
  return (
    <div className='quick-block'>
      <div className='content-wrapper'>
        <div className='quick-block-wrapper'>
          <p>
            Welcome to Cogniance Index, a landing page to rule them all
          </p>
          <div className='quick-cards-list'>
            {cards}
          </div>
        </div>
      </div>
    </div>
  );
}

const QuickLinks = connect(
  mapStateToProps,
  null,
)(RawQuickLinks);

export default QuickLinks;