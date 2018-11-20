import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    addBlock,
    blockDeleteFail,
    deleteBlock,
    updateBlock,
    updateBlockCards
} from "../../actions";
import BlockUpdateModal from "./modals/BlockUpdateModal";
import { Button, Modal } from 'react-bootstrap';
import BlockDeleteConfirm from "./modals/BlockDeleteConfirm";
import BlockCardsModal from "./modals/BlockCardsModal";
import {getIdsForDeleted, getActiveBlocks} from "../../actions/common";
import {reactLocalStorage} from 'reactjs-localstorage';
import Moment from "moment";


class BlockCrud extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            requiredItem: 0,
            blockNames: [],
            confirmStatus : false,
            deleteModal: false,
            blocks: {},
            mode: ''
        }
        this.replaceModalItem = this.replaceModalItem.bind(this);
        this.saveModalDetails = this.saveModalDetails.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.saveCardsModalDetails = this.saveCardsModalDetails.bind(this);
    }

    onAddBlock() {
        const data = {
            name: this.blockInputValue.value,
            description: this.blockDescriptionInputValue.value,
            createdBy: reactLocalStorage.get('user'),
            date: Date.now().toString()
        };

        this.props.addBlock(data);
        this.blockInputValue.value = '';
        this.blockDescriptionInputValue.value = '';
    }

    saveModalDetails(item) {

        const data = {
            newName: item.blockName,
            newDescription: item.blockDescription
        };

        const index = this.state.requiredItem.id;
        this.props.updateBlock(index, data);
        this.setState({ show: false});
    }


    saveCardsModalDetails(item) {

       let deletedCards = getIdsForDeleted(item);
        const data = {
            blockId: item.block.id,
            deletedCardsId: deletedCards ? deletedCards : "",
            addCard: item.add
        };

        this.props.updateBlockCards( data);
        this.setState({ show: false});
    }

    confirmDelete(bool) {
        if(bool){
            this.props.onDeleteClick(this.props.blocks[this.state.requiredItem]);
        }
        console.log(this.state.requiredItem);
        this.setState({ show: false, deleteModal: false});
    }

    replaceModalItem(item) {

        console.log(item);

        this.setState({
            requiredItem: item
        });
    }

    renderSwitch(param, modalData) {
        switch (param) {
            case 'confirm':
                return <BlockDeleteConfirm
                    modal={this.state.show}
                    blockName={modalData.name}
                    confirmDelete={this.confirmDelete}
                />;
            case 'update':
                return <BlockUpdateModal
                    modal={this.state.show}
                    blockName={modalData.name}
                    blockDescription={modalData.description}
                    saveModalDetails={this.saveModalDetails}
                />;
            case 'cardlist':
                return <BlockCardsModal
                    modal={this.state.show}
                    block={modalData}
                    saveCardsModalDetails={this.saveCardsModalDetails}
                    cards={this.props.cards}
                    status={this.state.status}
                />;
            default:
                return '';
        }
    }

    tryDeleteBlock(id) {
        fetch('/api/blocks/' + id, {method: 'DELETE', credentials: 'include'})
            .then(response => {
                response.json().then((data) => {
                    if (!data.allow) {
                        console.log(data);
                        this.setState({show: true, deleteModal: true, mode: 'confirm'});
                        this.props.blockDeleteFail();
                    } else {
                        console.log(data);
                        this.props.updateBlock();
                    }
                });

            });
    }

    render() {

        const dateString = (ut) => {
            return Moment.unix(ut/1000).format("ll");
        };

        let blocks = getActiveBlocks(this.props.blocks);
        let modalData = this.state.requiredItem;

        return (
            <div>
                <h2>Add more blocks</h2>
                <div className="form-group">
                    <label>Block name:</label>
                    <input type="text" className="form-control" ref={(input) => {
                        this.blockInputValue = input
                    }} placeholder="Enter block name"/>
                </div>
                <div className="form-group">
                    <label>Block description:</label>
                    <textarea className="form-control" rows="3" ref={(input) => {
                        this.blockDescriptionInputValue = input}}
                        placeholder="Enter block description" />
                </div>
                <button type="submit" className="btn btn-primary"
                        onClick={this.onAddBlock.bind(this)}>Submit
                </button>
                <hr/>
                <h2>Blocks</h2>
                <p>Available blocks:</p>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th className="col-2">Name</th>
                        <th className="col-6">Description</th>
                        <th className="col-2">Date</th>
                        <th className="col-2">Activity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {blocks.map((item, i) => {
                        return [
                            <tr key={item}>
                                <td className="col-2">
                                    <b>{item.name}</b>
                                </td>
                                <td className="col-6">
                                    <p>{item.description}</p>
                                </td>
                                <td className="col-2">
                                    <b>{dateString(item.date)}</b>
                                </td>
                                <td className="col-2">
                                    <Button
                                        bsStyle="primary"
                                        bsSize="xs"
                                        onClick={() => {this.setState({ show: true, mode: 'cardlist'}); this.replaceModalItem(item)}}
                                    >
                                        CARD LIST
                                    </Button>
                                    &nbsp;	&nbsp;
                                    <Button
                                        bsStyle="success"
                                        bsSize="xs"
                                        onClick={() => {this.setState({ show: true, mode: 'update'}); this.replaceModalItem(item)}}
                                    >
                                        UPDATE
                                    </Button>
                                    &nbsp;	&nbsp;
                                    <button
                                        onClick={() => { this.tryDeleteBlock(item.id); this.replaceModalItem(item)}}
                                        type="button" className="btn btn-danger btn-xs"
                                    >DELETE</button>
                                </td>
                            </tr>
                        ]
                    })}
                    </tbody>
                </table>

                {this.renderSwitch(this.state.mode, modalData)}
            </div>
        )
    }
}

// BlockCrud.propTypes = {
//     blocks: PropTypes.object.isRequired
// };

const mapStateToProps = (state, original) => {
    return Object.assign({}, original, {
        cards: state.cards,
        blocks: state.blocks
    });
}

const mapDispatchToProps = (dispatch) => {
    return {
        addBlock: (data) => {
            dispatch(addBlock(data));
        },

        onDeleteClick: (item) => {
            dispatch(deleteBlock(item))
        },

        updateBlock: (index, data) => {
            dispatch(updateBlock(index, data))
        },

        updateBlockCards: (data) => {
            dispatch(updateBlockCards(data))
        },

        blockDeleteFail : () => {
            dispatch(blockDeleteFail())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlockCrud);
