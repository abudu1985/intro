import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as editActions from '../../actions/edit';
import CardsWithCardOrder from "./CardsWithCardOrder";
import {fetchCards} from '../../actions';
import {getActiveBlocksWithCards} from "../../actions/common";

class CardOrder extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        let blocks = getActiveBlocksWithCards(this.props.blocks);

        return (
            <div>
                <CardsWithCardOrder
                    onEditInit={this.props.onEditInit}
                    canEdit={this.props.canEdit}
                    cards={this.props.cards.filter(c => !c.hidden)}
                    blockNames={blocks}/>
            </div>
        )
    }
}

CardOrder.propTypes = {
    cards: PropTypes.array.isRequired,
    canEdit: PropTypes.bool.isRequired,
    edit: PropTypes.object.isRequired,
    onEditInit: PropTypes.func.isRequired,
    onEditApply: PropTypes.func.isRequired,
    onEditCancel: PropTypes.func.isRequired,
    blocks: PropTypes.array.isRequired,
};


const mapStateToProps = (state, original) => {
    return Object.assign({}, original, {
        cards: state.cards,
        canEdit: state.userInfo.canEdit,
        edit: state.edit,
        blocks: state.blocks
    });
}

const mapDispatchToProps = (dispatch) => {
    return {
        onEditInit: cardID => {
            dispatch(editActions.cardEditInit(cardID));
        },

        onEditCancel: () => {
            dispatch(editActions.cardEditCancel());
        },

        onEditApply: (cardInfo) => {
            dispatch(editActions.cardEditApply(cardInfo));
        },

        sendCard: (cardInfo) => {
            dispatch(pushCard(cardInfo));
        },

        updateCardsList: () => {
            dispatch(fetchCards());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardOrder);