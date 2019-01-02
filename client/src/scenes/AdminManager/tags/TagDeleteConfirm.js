import React from 'react';
import { Button, Modal } from 'react-bootstrap';


class TagDeleteConfirm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            show: props.modal
        };
    }

    cancelDelete() {
        this.props.confirmDelete();
    }

    render(){

        let close = () => this.setState({ show: false});

        return (
            <div className="modal-container">
                <Modal
                    show={this.props.modal}
                    onHide={close}
                    container={this}
                    aria-labelledby="contained-modal-title"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title">Deleting Tag.</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <h3>Warning!</h3>
                        </div>
                        <h4>This tag used in cards, you can not delete it.</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => { this.cancelDelete(); close(); }}>CANCEL</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default TagDeleteConfirm;