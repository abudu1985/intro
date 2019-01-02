import React from 'react';
import PropTypes from 'prop-types';

import { groupByQuickLinks } from "../../../actions/common";
import QuickLinksCardOrderThematic from "./QuickLinksCardOdrerThematic";

const QuickLinksWithCardOrder = ({ onEditInit, canEdit, cards, quickLinks}) => {

    let innerBlocks = [];

    quickLinks.forEach((value, i) => {
        innerBlocks.push(
            <QuickLinksCardOrderThematic
                blockName={value.name}
                cards={groupByQuickLinks(cards, value)}
                key={i}
                admin={canEdit}
                onEditInit={onEditInit}
                quickLinkId={value._id}
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

QuickLinksWithCardOrder.prototype.propTypes = {
    onEditInit: PropTypes.func.isRequired,
    canEdit: PropTypes.bool.isRequired,
    cards: PropTypes.array.isRequired,
    quickLinks: PropTypes.array.isRequired
};

export default QuickLinksWithCardOrder;