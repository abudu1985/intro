import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import {getCardsNames, cardsOutsideBlock} from "../../../actions/common";
import Chkboxlist from "./Chkboxlist";
import SelectListGroup from "./SelectListGroup";


class BlockCardsModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            show: props.modal,
            block: props.block,
            cards: props.cards
        };
        this.handleSave = this.handleSave.bind(this);
        this.onChangeSelect = this.onChangeSelect.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.show !== nextProps.modal) {
            this.setState({
                show: nextProps.modal,
                block: nextProps.block
            })
        }
    }

    handleSave() {
        const item = this.state;
        this.props.saveCardsModalDetails(item);
    }

    onChange(name, values) {
        this.setState({ [name]: values })
    }

    onChangeSelect(e) {
        this.setState({ add: e.target.value });
    }


    render(){
        let close = () => this.setState({ show: false});

        let cardsNames = getCardsNames(this.state.cards,this.state.block);

        let options = cardsOutsideBlock(this.state.cards,this.state.block);

        return (
            <div className="modal-container">
                <Modal
                    show={this.state.show}
                    onHide={close}
                    container={this}
                    aria-labelledby="contained-modal-title"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title">Block Cards</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className="form-group">
                            <label>Block name:</label>
                            <h3><b>{this.state.block.name}</b></h3>
                            { this.state.block.cards.length !== 0 ?
                            <div className="list-group">
                                <h4>Cards</h4>
                                <h5 style={{color:'red'}}>Check to delete from block.</h5>
                                <Chkboxlist
                                onChange={(values) => this.onChange('delete', values)}
                                values={cardsNames}
                                />
                                </div>
                                :'' }
                            <hr/>
                            <h5 style={{color:'green'}}>Add card to block.</h5>
                            <SelectListGroup
                                placeholder="Add"
                                name="add"
                                onChange={this.onChangeSelect}
                                options={options}
                            />
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="primary" onClick={() => { this.handleSave(); close(); }}>Save</Button>
                        <Button onClick={close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default BlockCardsModal;