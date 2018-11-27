import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import style from './style.scss';
import {mixBlockNames} from "../../actions";
import ThematicBlock from "../../components/ThematicBlock";
import {getActiveBlocksWithCards, groupByBlocks} from "../../actions/common";


class CardsWithBlockOrder extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        let state = {
            items: this.props.blocks,
        };

        const SortableItem = SortableElement(({value, i}) =>

        <ThematicBlock
        blockName={value.name}
        cards={groupByBlocks(this.props.cards, value)}
        key={i}
        admin={this.props.canEdit}
        onEditInit={this.props.onEditInit}
        showBorder={true}/>
        );

        const SortableList = SortableContainer(({items}) => {
            return (
                <div>
                    {items.map((value, index) => (
                        <SortableItem key={`item-${index}`} index={index} value={value} />
                    ))}
                </div>
            );
        });

        let blocks = getActiveBlocksWithCards(this.props.blocks);

        const toSortEnd = ({oldIndex, newIndex}) => {

            let data = {
                initId: blocks[oldIndex].id,
                initOrder: blocks[oldIndex].order,
                posId: blocks[newIndex].id,
                posOrder: blocks[newIndex].order,
                info: blocks[oldIndex].name + " / " + blocks[newIndex].name
            };

            this.setState({
                items: arrayMove(state.items, oldIndex, newIndex),
            });
            this.props.reorderBlockNames(data);
        };

        return (
            <div className='cards-block'>
                <div className='content-wrapper'>
                    <div className='cards-block-wrapper'>
                        <SortableList items={blocks} onSortEnd={toSortEnd} distance={10}/>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state, original) => {
    return Object.assign({}, original, {
        canEdit: state.userInfo.canEdit,
        edit: state.edit,
        blocks: state.blocks
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        reorderBlockNames: (items) => {
            dispatch(mixBlockNames(items))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CardsWithBlockOrder);
