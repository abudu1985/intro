import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

import style from './style.scss';
import {mixCards} from "../../actions";
import Card from "../../components/Card";
import CardWithoutLink from "./CardWithoutLink";


class CardOrderThematicBlock extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        let state = {
            items: this.props.cards,
            block: this.props.blockName,
            blockId: this.props.blockId
        };

        const SortableItem = SortableElement(({value}) =>
            <CardWithoutLink
                title={value.title}
                description={value.description}
                pic={value.pic}
                url={value.url}
                key={value.id + value.title}/>
        );

        const SortableList = SortableContainer(({items}) => {
            return (
                <div className='cards-list-without-blocks'>
                    {items.map((value, index) => (
                        <SortableItem key={`item-${index}`} index={index} value={value} />
                    ))}
                </div>
            );
        });

        const toSortEnd = ({oldIndex, newIndex}) => {
            let data = {
                blockId: state.blockId,
                initId: state.items[oldIndex].id,
                posId: state.items[newIndex].id,
                info: state.block + ", " + state.items[oldIndex].title + " / " + state.items[newIndex].title
            };

            this.setState({
                items: arrayMove(state.items, oldIndex, newIndex),
            });
            this.props.reorderCards(data)
        };

        return (

           <div className={'thematic-block'}>
                <h2>{this.props.blockName}</h2>
                <SortableList items={this.props.cards} onSortEnd={toSortEnd} />
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        reorderCards: (data) => {
            dispatch(mixCards(data))
        }
    }
};

export default connect(null, mapDispatchToProps)(CardOrderThematicBlock);
