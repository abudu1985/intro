import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import {cardsForQuickLinks, getCardsNamesForQL} from "../../../actions/common";
import SelectListGroup from "../modals/SelectListGroup";
import Chkboxlist from "../modals/Chkboxlist";
const $ = require('jquery');


class QuickLinkCardsModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            show: props.modal,
            block: props.block,
            cards: props.cards,
            quickLinks: props.quickLinks
        };
        this.handleSave = this.handleSave.bind(this);
        this.onChangeSelect = this.onChangeSelect.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.show !== nextProps.modal) {
            this.setState({
                show: nextProps.modal,
                block: nextProps.block,
                quickLinks: nextProps.quickLinks,
                cards: nextProps.cards
            })
        }
    }

    handleSave() {
        const item = this.state;
        this.props.saveCardsModalDetails(item);
        this.setState({
            delete: '',
            add: ''
        });
    }

    onChange(name, values) {
        this.setState({ [name]: values })
    }

    onChangeSelect(e) {
        this.setState({ add: e.target.value });
    }


    render(){

        if(this.state.show){
            $('.tabs-container .tab-nav').css("position", "unset");
        } else {
            $('.tabs-container .tab-nav').css("position", "relative");
        }

        let close = () => this.setState({ show: false});

        let cardsNames = getCardsNamesForQL(this.state.cards,this.state.quickLinks[0]);

        let options = cardsForQuickLinks(this.state.cards,this.state.quickLinks);

        return (
            <div className="modal-container">
                <Modal
                    show={this.state.show}
                    onHide={close}
                    container={this}
                    aria-labelledby="contained-modal-title"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title">QuickLinks Cards</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className="form-group">
                            {cardsNames.length !== 0 ?
                                <div className="list-group">
                                    <h4>Links</h4>
                                    <h5 style={{color:'red'}}>Check to delete from block.</h5>
                                    <Chkboxlist
                                        onChange={(values) => this.onChange('delete', values)}
                                        values={cardsNames}
                                    />
                                </div>
                                :'' }
                            <hr/>
                            <h5 style={{color:'green'}}>Add card to QuickLinks.</h5>
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

export default QuickLinkCardsModal;