import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as editActions from '../../actions/edit';
import CardsWithBlockOrder from "./CardsWithBlockOrder";
import { fetchCards, fetchBlocks } from '../../actions';


class BlockOrder extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.getBlocks();
    }

    render() {
        return (
            <div>
                <CardsWithBlockOrder
                    onEditInit={this.props.onEditInit}
                    canEdit={this.props.canEdit}
                    cards={this.props.cards.filter(c => !c.hidden)} />
            </div>
        )
    }
}

BlockOrder.propTypes = {
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
        },

        getBlocks: () => {
            dispatch(fetchBlocks());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlockOrder);