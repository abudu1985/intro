import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import style from './style.scss';
import {
    addBlock,
    blockDeleteFail,
    deleteBlock,
    updateBlock,
    updateBlockCards,
    addLog
} from "../../actions";
import BlockUpdateModal from "./modals/BlockUpdateModal";
import { Button, Modal } from 'react-bootstrap';
import BlockDeleteConfirm from "./modals/BlockDeleteConfirm";
import BlockCardsModal from "./modals/BlockCardsModal";
import {getIdsForDeleted, getActiveBlocks, getNameOfAdded} from "../../actions/common";
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
            mode: '',
            emptyTag: false
        };
        this.replaceModalItem = this.replaceModalItem.bind(this);
        this.saveModalDetails = this.saveModalDetails.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.saveCardsModalDetails = this.saveCardsModalDetails.bind(this);
        this.confirmCancel = this.confirmCancel.bind(this);
        this.onAddBlock = this.onAddBlock.bind(this);
        this.onStartTypeBlockName = this.onStartTypeBlockName.bind(this);
        this.blurHandler = this.blurHandler.bind(this);
    }

    onAddBlock() {
        if (this.blockInputValue.value.trim() === "") {
            this.setState({emptyTag: true});
        } else {
            console.log('not empty');
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
    }

    confirmCancel() {
        this.setState({ show: false });
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

       let added = getNameOfAdded(item, item.add);
       let deleted = item.delete ? Object.keys(item.delete) : "";
       let name = item.block.name;

        const data = {
            blockId: item.block.id,
            deletedCardsId: deletedCards,
            addCard: item.add,
            info: added ? "add: " + added : "" +  deleted ? ", deleted: " + deleted : "",
            name: name
        };

        this.props.updateBlockCards(data);
        this.setState({ show: false});
    }

    confirmDelete(bool) {
        if(bool){
            this.props.onDeleteClick(this.props.blocks[this.state.requiredItem]);
        }
        this.setState({ show: false, deleteModal: false});
    }

    replaceModalItem(item) {

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

    tryDeleteBlock(id, name) {
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
                        this.props.writeLog("Block", reactLocalStorage.get('user'), "DELETE", Date.now().toString(), name);
                    }
                });

            });
    }

    onStartTypeBlockName(event) {
        if (event.target.value.trim() !== "") {
            this.setState({emptyTag: false});
        } else {
            this.setState({emptyTag: true});
        }
    }

    blurHandler() {
        this.setState({emptyTag: false});
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
                <div className={this.state.emptyTag ? "form-group has-error" : "form-group"}>
                    <label>Block name<span style={{'color': 'red'}}><b>*</b></span>:</label>
                    <input type="text"
                           className="form-control"
                           ref={(input) => {this.blockInputValue = input}}
                           placeholder="Enter block name"
                           onChange={this.onStartTypeBlockName}
                           onBlur={this.blurHandler}
                           required
                    />
                    {this.state.emptyTag ? <span className="help-block">Block name should not be empty.</span> : ""}
                </div>
                <div className="form-group">
                    <label>Block description:</label>
                    <textarea className="form-control" rows="3" ref={(input) => {
                        this.blockDescriptionInputValue = input}}
                        placeholder="Enter block description" />
                </div>
                <button type="submit" className="btn btn-primary"
                        onClick={() => {this.onAddBlock();}}>Submit
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
                                        onClick={() => { this.tryDeleteBlock(item.id, item.name); this.replaceModalItem(item)}}
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

        onDeleteClick: (item, ) => {
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
        },

        writeLog : (entity, initiator, action, date, info) => {
            dispatch(addLog(entity, initiator, action, date, info))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlockCrud);
