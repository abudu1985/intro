import React from 'react';
import PropTypes from 'prop-types';

import CardOrderThematicBlock from "./CardOrderThematicBlock";
import {groupByBlocks} from "../../actions/common";

const CardsWithCardOrder = ({onEditInit, canEdit, cards, blockNames}) => {

    let innerBlocks = [];

    blockNames.forEach((value, i) => {
        innerBlocks.push(
            <CardOrderThematicBlock
                blockName={value.name}
                cards={groupByBlocks(cards, value)}
                key={i}
                admin={canEdit}
                onEditInit={onEditInit}
                blockId={value.id}
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

CardsWithCardOrder.prototype.propTypes = {
    onEditInit: PropTypes.func.isRequired,
    canEdit: PropTypes.bool.isRequired,
    cards: PropTypes.array.isRequired,
    blockNames: PropTypes.array.isRequired
};

export default CardsWithCardOrder;