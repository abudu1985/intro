import React, { Component } from "react";
import { connect } from "react-redux";
import {Redirect} from "react-router-dom";
import style from './style.scss';

import Header from "../../components/Header";
import {fetchAdmins} from "../../actions/admins";
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import BlockDeleteConfirm from "../AdminManager/modals/BlockDeleteConfirm";
import BlockUpdateModal from "../AdminManager/modals/BlockUpdateModal";
import BlockCardsModal from "../AdminManager/modals/BlockCardsModal";
import EventUpdateModal from "../AdminManager/modals/EventUpdateModal";
import EventCreateModal from "../AdminManager/modals/EventCreateModal";

class Calendar extends Component {
    constructor() {
        super();
        this.state = {
            show: false,
            selectedEvent: '',
            startDate: '',
            endDate: ''
        }
        this.saveCreateModalDetails = this.saveCreateModalDetails.bind(this);
    }

    componentWillMount() {
    }

    onSlotChange(slotInfo) {
        // let startDate = moment(slotInfo.start.toLocaleString()).format("YYYY-MM-DD m:ss");
        // let endDate = moment(slotInfo.end.toLocaleString()).format("YYYY-MM-DD cd m:ss");
        let startDate = slotInfo.start;
        let endDate = slotInfo.end;
        console.log(startDate); //shows the start time chosen
        console.log(endDate); //shows the end time chosen
        this.setState({ show: true, mode: 'create', startDate: startDate, endDate: endDate});
    }

    onEventClick(event) {
        console.log(event); //Shows the event details provided while booking
        this.setState({ show: true, mode: 'update', selectedEvent: event});
    }

    saveCreateModalDetails(item) {

        const data = {
            start: item.start,
            end: item.end,
            who: item.who,
            initiator: '',
            cause: item.cause,
            description: item.description,
            group: 2
            //info: added ? "add: " + added : "" +  deleted ? ", deleted: " + deleted : "",
        };
        console.log(data);
    }

    renderSwitch(param, modalData) {
        switch (param) {
            case 'update':
                return <EventUpdateModal
                    modal={this.state.show}
                    blockName="event"
                    blockDescription="desc"
                    saveModalDetails={this.saveModalDetails}
                />;
            case 'create':
                return <EventCreateModal
                    modal={this.state.show}
                    block={modalData}
                    saveModalDetails={this.saveCreateModalDetails}
                    cards={this.props.cards}
                    status={this.state.status}
                    start={this.state.startDate}
                    end={this.state.endDate}
                />;
            default:
                return '';
        }
    }

    render() {
        let myEventsList = [
                {
                    'title': 'My event',
                    'allDay': true,
                    'start': new Date(2019, 0, 1, 10, 0), // 10.00 AM
                    'end': new Date(2019, 0, 1, 15, 0), // 2.00 PM
                    'group': 2
                },
                {
                    'title': 'Conference',
                    'start': new Date(2018, 11, 1),
                    'end': new Date(2019, 0, 2),
                    desc: 'Big conference for important people'
                },
                {
                    'title': 'Meeting',
                    'start': new Date(2019, 0, 1, 10, 30, 0, 0),
                    'end': new Date(2019, 0, 1, 12, 30, 0, 0),
                    desc: 'Pre-meeting meeting, to prepare for the meeting'
                },
                {
                    'title': 'Lunch',
                    'start':new Date(2019, 0, 1, 12, 0, 0, 0),
                    'end': new Date(2019, 0, 1, 13, 0, 0, 0),
                    desc: 'Power lunch'
                }
                ];

        let localizer = BigCalendar.momentLocalizer(moment);
        let modalData = this.state.selectedEvent;

        return (
            <div>
                <Header adminPage={true}/>
                <hr/>
                <div className="container">
                    <BigCalendar
                        selectable
                        onSelectEvent={event => this.onEventClick(event)}
                        onSelectSlot={(slotInfo) => this.onSlotChange(slotInfo) }
                        events={myEventsList}
                        step={60}
                        defaultDate={new Date()}
                        localizer={localizer}
                    />
                </div>
                {this.renderSwitch(this.state.mode, modalData)}
            </div>
        );
    }
}


const mapStateToProps = (state, original) => {
    return Object.assign({}, original, {
        canEdit: state.userInfo.canEdit,
    });
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateAdminsList: () => {
            dispatch(fetchAdmins());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);