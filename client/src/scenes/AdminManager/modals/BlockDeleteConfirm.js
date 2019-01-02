import React from 'react';
import { Button, Modal } from 'react-bootstrap';
const $ = require('jquery');


class BlockDeleteConfirm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            show: props.modal,
            blockName: ''
        };
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {
        this.props.confirmDelete();
    }

    render(){

        if(this.state.show){
            $('.tabs-container .tab-nav').css("position", "unset");
        } else {
            $('.tabs-container .tab-nav').css("position", "relative");
        }

        let close = () => this.setState({ show: false});
        return (
            <div className="modal-container">
                <Modal
                    show={this.state.show}
                    onHide={close}
                    container={this}
                    aria-labelledby="contained-modal-title"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title">Deleting Block.</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <h3>Warning!</h3>
                        </div>
                        <h4>Move cards from this block into other blocks and then try again.</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => { this.handleDelete(); close(); }}>CANCEL</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default BlockDeleteConfirm;