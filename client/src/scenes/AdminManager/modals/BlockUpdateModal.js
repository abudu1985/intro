import React from 'react';
import { Button, Modal } from 'react-bootstrap';
const $ = require('jquery');


class BlockUpdateModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            show: props.modal,
            blockName: props.blockName,
            blockDescription: props.blockDescription
        };
        this.handleSave = this.handleSave.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.show !== nextProps.modal) {
            this.setState({
                show: nextProps.modal,
                blockName: nextProps.blockName,
                blockDescription: nextProps.blockDescription
            })
        }
    }

    blockNameHandler(e) {
        this.setState({ blockName: e.target.value });
    }

    blockDescriptionHandler(e) {
        this.setState({ blockDescription: e.target.value });
    }

    handleSave() {
        const item = this.state;
        this.props.saveModalDetails(item);
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
                        <Modal.Title id="contained-modal-title">Edit Block</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="form-group">
                                <label>Block name</label>
                                <input type='text' className="form-control" value={this.state.blockName}
                                       onChange={(e) => this.blockNameHandler(e)}/>
                            </div>
                            <div className="form-group">
                                <label>Block description</label>
                                <textarea className="form-control" rows="3" value={this.state.blockDescription}
                                          onChange={(e) => this.blockDescriptionHandler(e)}/>
                            </div>
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

export default BlockUpdateModal;