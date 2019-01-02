import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Edit from './../Edit';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import QuickLinks from '../../components/QuickLinks';
import AdminBar from '../../components/AdminBar';

import * as editActions from '../../actions/edit';
import {fetchCards, fetchBlocks} from '../../actions';
import {getActiveBlocksWithFilterableCards} from '../../actions/common'
import AnimateCards from "../../components/animate/AnimateCards";
import {fetchQuickLinks} from "../../actions/quickLinks";


class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.updateQuickLinks();
        this.props.updateCardsList();
        this.props.getBlocks();
    }

    render() {

        let blocks = getActiveBlocksWithFilterableCards(this.props.blocks, this.props.cards);

        return (
            <div>
                <Header adminPage={false}/>
                {this.props.quickLinks ? <QuickLinks/> : ""}
                {this.props.canEdit ? <AdminBar initEditing={this.props.onEditInit}/> : null}
                <AnimateCards
                    onEditInit={this.props.onEditInit}
                    canEdit={this.props.canEdit}
                    cards={this.props.cards.filter(c => !c.hidden)}
                    blockNames={blocks}
                />
                <Footer/>
                {this.props.edit.editing ?
                    <Edit
                        cancelEditing={this.props.onEditCancel}
                        applyEdit={this.props.onEditApply}
                        sendEdit={this.props.sendCard}/> :
                    null}
            </div>
        )
    }
}

Main.propTypes = {
  cards: PropTypes.array.isRequired,
  canEdit: PropTypes.bool.isRequired,
  edit: PropTypes.object.isRequired,
  onEditInit: PropTypes.func.isRequired,
  onEditApply: PropTypes.func.isRequired,
  onEditCancel: PropTypes.func.isRequired,
  blocks: PropTypes.array.isRequired
};


const mapStateToProps = (state, original) => {
  return Object.assign({}, original, {
    cards: state.cards,
    canEdit: false,//state.userInfo.canEdit,
    edit: state.edit,
    blocks: state.blocks,
    quickLinks: state.quickLinks
  });
};

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
    },

    updateQuickLinks: () => {
        dispatch(fetchQuickLinks());
    },
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Main);