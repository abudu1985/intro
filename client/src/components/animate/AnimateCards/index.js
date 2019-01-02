import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AnimateThematicBlock from '../AnimateThematicBlock';
import style from './style.scss';
import {groupByBlocks} from "../../../actions/common";


const AnimateCards = ({onEditInit, canEdit, cards, blockNames}) => {

    let innerBlocks = [];

    blockNames.forEach((value, i) => {
        innerBlocks.push(
            <AnimateThematicBlock
                blockName={value.name}
                cards={groupByBlocks(cards, value)}
                key={i}
                admin={canEdit}
                onEditInit={onEditInit}
                showBorder={false}/>
        );
    });
    return (
        <div className='cards-block'>
            <div className='content-wrapper'>
                <div className='cards-block-wrapper'>
                    {innerBlocks}
                </div>
            </div>
        </div>
    )
}

AnimateCards.prototype.propTypes = {
  onEditInit: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
  cards: PropTypes.array.isRequired,
  blockNames: PropTypes.array.isRequired
};

export default AnimateCards;