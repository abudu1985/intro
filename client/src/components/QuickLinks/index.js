import React from 'react';
import { connect } from 'react-redux';

import IconImage from '../IconImage';

import style from './style.scss';
import {COMPANY_NAME} from '../../../variables';
import {groupByQuickLinks} from "../../actions/common";

const mapStateToProps = (state) => {
    return {
        showQuickLinks: state.additions.showQuickLinks,
        cards: state.cards,
        quickLinks: state.quickLinks
    };
};

function QuickCard(props) {
  return (
    <a className='quick-card' href={props.card.url} target='_blank'>
      <IconImage src={props.card.pic} />
      <span>{props.card.title}</span>
    </a>
  )
}


function RawQuickLinks(props) {

    if (props.quickLinks[0] && props.quickLinks[0].cards.length !== 0) {

        let cards = groupByQuickLinks(props.cards, props.quickLinks[0]);
        if (cards.length !== 0) {

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
                                Welcome to {COMPANY_NAME} Index, a landing page to rule them all
                            </p>
                            <div className='quick-cards-list'>
                                {cards}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
    return (<div></div>)
}

const QuickLinks = connect(mapStateToProps, null)(RawQuickLinks);

export default QuickLinks;