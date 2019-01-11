import React from 'react';
import { Button, Modal } from 'react-bootstrap';
const $ = require('jquery');
import moment from "moment";
import SelectListGroup from "./SelectListGroup";
let DateTimeField = require('react-bootstrap-datetimepicker');


class EventCreateModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            show: props.modal,
            who: '',
            description: '',
            start: props.start,
            end: props.end,
            moment: moment(),
            startDate: new Date(),
            allDay: false,
            newCause: false,
            cause: ''
        };
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAllDayChange = this.handleAllDayChange.bind(this);
        this.onChangeSelect = this.onChangeSelect.bind(this);
        this.returnToDefaultCause = this.returnToDefaultCause.bind(this);
        this.whoHandler = this.whoHandler.bind(this);
        this.descriptionHandler = this.descriptionHandler.bind(this);
        this.changeCauseInput = this.changeCauseInput.bind(this);
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

    whoHandler(e) {
        this.setState({who: e.target.value});
    }

    descriptionHandler(e) {
        this.setState({description: e.target.value});
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

    handleAllDayChange(e) {
        if(e.target.checked) {
            console.log("checked");
            this.setState({allDay: true});
        } else {
            console.log("unchecked");
            this.setState({allDay: false});
        }
    }

    onChangeSelect(e) {
        if(e.target.value == 5) {
            this.setState({newCause: true})
        } else {
            this.setState({cause: e.target.label})
        }
    }

    returnToDefaultCause() {
        this.setState({newCause: false});
    }

    changeCauseInput(e) {
        this.setState({cause: e.target.value})
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

        const {allDay} = this.state;

        const {newCause} = this.state;

        const options = [
            { label: "meeting", value: 1 },
            { label: "sick leave", value: 2 },
            { label: "family reasons", value: 3 },
            { label: "vacation", value: 4 },
            { label: "create another", value: 5 }
        ];

        const toDefCauseStyle = {
            cursor: 'pointer',
            color: 'blue',
            textDecoration: 'underline',
            fontSize: '11px',
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
                                <label>Who:</label>
                                <input type="text"
                                       className="form-control"
                                       onChange={(e) => this.whoHandler(e)}
                                />
                            </div>
                            <div className="form-group">
                                <input type="checkbox" onChange={this.handleAllDayChange}/>
                                <label>&nbsp;&nbsp;All day</label>
                            </div>
                            <div className="form-group">
                                <label>From:</label>
                                <DateTimeField type='text' className="form-control" dateTime={this.state.start}
                                       onChange={(e) => this.blockNameHandler(e)}
                                               mode={!allDay ? 'datetime' : 'date'}
                                />
                            </div>
                            <div className="form-group">
                                <label>To:</label>
                                <DateTimeField className="form-control" dateTime={this.state.end}
                                          onChange={(e) => this.blockDescriptionHandler(e)}
                                               mode={!allDay ? 'datetime' : 'date'}
                                />
                            </div>
                            <div className="form-group">
                                <label>Cause:&nbsp;
                                    {newCause ? <span style={toDefCauseStyle}
                                                      onClick={this.returnToDefaultCause}
                                        >defaults</span>
                                        : ''}</label>
                                {newCause ? <input type="text"
                                                   className="form-control"
                                                   onChange={this.changeCauseInput}
                                    /> :
                                    <SelectListGroup
                                        placeholder="Add"
                                        name="add"
                                        onChange={this.onChangeSelect}
                                        options={options}
                                    />
                                }
                            </div>
                            <div className="form-group">
                                <label>Desc:</label>
                                <textarea className="form-control" rows="2"
                                          onChange={(e) => this.descriptionHandler(e)}/>
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