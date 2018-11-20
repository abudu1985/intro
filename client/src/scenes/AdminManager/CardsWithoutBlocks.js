import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import style from './style.scss';
import CardsWithoutBlocksThematic from "./CardsWithoutBlocksThematic";


const CardsWithoutBlocks = ({onEditInit, canEdit, cards}) => {

    return (
        <div className='cards-block'>
            <div className='content-wrapper'>
                <div className='cards-block-wrapper'>
                    <CardsWithoutBlocksThematic
                        cards={cards}
                        admin={canEdit}
                        onEditInit={onEditInit}
                    />
                </div>
            </div>
        </div>
    )
};

CardsWithoutBlocks.prototype.propTypes = {
    onEditInit: PropTypes.func.isRequired,
    canEdit: PropTypes.bool.isRequired,
    cards: PropTypes.array.isRequired,
};

export default CardsWithoutBlocks;