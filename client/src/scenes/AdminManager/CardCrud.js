import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Edit from './../Edit';
import AdminBar from '../../components/AdminBar';
import * as editActions from '../../actions/edit';
import {fetchCards} from '../../actions';
import CardsWithoutBlocks from "./CardsWithoutBlocks";


class CardCrud extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.updateCardsList();
    }

    render() {
        return (
            <div>
                <AdminBar initEditing={this.props.onEditInit}/>
                <CardsWithoutBlocks
                    onEditInit={this.props.onEditInit}
                    canEdit={this.props.canEdit}
                    cards={this.props.cards.filter(c => !c.hidden)}
                />
                { this.props.edit.editing ?
                    <Edit
                        cancelEditing={this.props.onEditCancel}
                        applyEdit={this.props.onEditApply}
                        sendEdit={this.props.sendCard}/> :
                    null }
            </div>
        )
    }
}

CardCrud.propTypes = {
    cards: PropTypes.array.isRequired,
    canEdit: PropTypes.bool.isRequired,
    edit: PropTypes.object.isRequired,
    onEditInit: PropTypes.func.isRequired,
    onEditApply: PropTypes.func.isRequired,
    onEditCancel: PropTypes.func.isRequired,
};


const mapStateToProps = (state, original) => {
    return Object.assign({}, original, {
        cards: state.cards,
        canEdit: state.userInfo.canEdit,
        edit: state.edit,
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

export default connect(mapStateToProps, mapDispatchToProps)(CardCrud);