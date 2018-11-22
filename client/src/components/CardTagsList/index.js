import React from 'react';
import { connect } from 'react-redux';

import style from './style.scss';
import {deleteTagFromCard} from "../../actions/tags";
import {blockDeleteFail} from "../../actions";


class CardTagsList extends React.Component {
    constructor(props) {
        super(props);
    }


    onDeleteClick(index) {
        this.props.onDeleteTag(index);
    }

    render() {
        let tagItems = this.props.cardInfo.tags.map((item, i) => {
            return <div key={i} className="tag_item">
                {item + "  "}
                <button
                type="button"
                onClick={() => this.onDeleteClick(i)}
                className="close-icon"
                >X</button>
            </div>
            }
        );
        return (
                <div>{tagItems ? tagItems : ''}</div>
        )
    }
}

const mapStateToProps = (state, original) => {
    return Object.assign({}, original, {
        tags: state.tags,
        cardInfo: state.edit,
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDeleteTag: (index) => {
            dispatch(deleteTagFromCard(index))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CardTagsList);
