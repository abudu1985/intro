import React from 'react';
import PropTypes from 'prop-types';


import style from './style.scss';
import EditableCard from "../../components/EditableCard";


const CardsWithoutBlocksThematic = (props) => {

        let cards = props.cards.map((card) =>
            <EditableCard
                title={card.title}
                description={card.description}
                pic={card.pic}
                url={card.url}
                onClick={() => props.onEditInit(card.id)}
                key={card.id+card.title}/>
        );

    return (
        <div className={'thematic-block'}>
            <div className='cards-list'>{cards}</div>
        </div>
    );
};

CardsWithoutBlocksThematic.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.object).isRequired,
    onEditInit: PropTypes.func.isRequired,
    admin: PropTypes.bool.isRequired,
};

export default CardsWithoutBlocksThematic;