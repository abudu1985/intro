import React from 'react';
import { Button, Modal } from 'react-bootstrap';
const $ = require('jquery');
import {DatetimePickerTrigger} from 'rc-datetime-picker';
import moment from "moment";
import DatePicker from "react-datepicker";


class EventCreateModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            show: props.modal,
            blockName: props.blockName,
            blockDescription: props.blockDescription,
            start: props.start,
            end: props.end,
            moment: moment()
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

    handleChange(moment){
        this.setState({
            moment: moment
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
                                {/*<DatetimePickerTrigger*/}
                                    {/*shortcuts={shortcuts}*/}
                                    {/*moment={this.state.moment}*/}
                                    {/*onChange={this.handleChange()}>*/}
                                    {/*<input type="text" value={this.state.end} readOnly />*/}
                                {/*</DatetimePickerTrigger>*/}
                                <DatePicker
                                    selected={this.state.start}
                                    onChange={this.handleChange}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    timeCaption="time"
                                    dropdownMode="select"
                                />
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