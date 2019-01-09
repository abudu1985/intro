import React from 'react';
import { Button, Modal } from 'react-bootstrap';
const $ = require('jquery');
import moment from "moment";
let DateTimeField = require('react-bootstrap-datetimepicker');


class EventCreateModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            show: props.modal,
            blockName: props.blockName,
            blockDescription: props.blockDescription,
            start: props.start,
            end: props.end,
            moment: moment(),
            startDate: new Date()
        };
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
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

    handleChange(date) {
        this.setState({
            startDate: date
        });
    }

    render(){

        if(this.state.show){
            $('.tabs-container .tab-nav').css("position", "unset");
        } else {
            $('.tabs-container .tab-nav').css("position", "relative");
        }

        let close = () => this.setState({ show: false});

        const shortcuts = {
            'Today': moment(),
            'Yesterday': moment().subtract(1, 'days'),
            'Clear': ''
        };

        return (
            <div className="modal-container">
                <Modal
                    show={this.state.show}
                    onHide={close}
                    container={this}
                    aria-labelledby="contained-modal-title"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title">Create Event</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="form-group">
                                <label>From:</label>
                                <input type='text' className="form-control" value={this.state.start}
                                       onChange={(e) => this.blockNameHandler(e)}/>
                            </div>
                            <div className="form-group">
                                <label>To:</label>
                                <textarea className="form-control" rows="3" value={this.state.end}
                                          onChange={(e) => this.blockDescriptionHandler(e)}/>
                            </div>
                            <div className="form-group">
                            <DateTimeField />
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

export default EventCreateModal;