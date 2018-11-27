import React from 'react';
import { connect } from 'react-redux';
const $ = require('jquery');
$.DataTable = require('datatables.net');
import style from './style.scss';
//import './datatables.scss';
import Moment from "moment";
let DatePicker = require("react-bootstrap-date-picker");
import { fetchLogs} from "../../actions";


class LogTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: new Date().toISOString()
        };

        this.handleChange = this.handleChange.bind(this);
        this.filterDate = this.filterDate.bind(this);
    }

    componentWillMount(){
        this.props.updateLogsList();
    }

    componentWillUnmount(){
        $('.data-table-wrapper').find('table').DataTable().destroy(true);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.logs.length !== 0 && nextProps.logs.length !== this.props.logs.length) {
            this.props.updateLogsList();
        }
        return false;
    }

    filterDate(value, formattedValue) {
        const table = $('.data-table-wrapper').find('table').DataTable();
        if(formattedValue){
            table.columns(2).search( formattedValue ).draw();
        } else {
            this.props.updateLogsList();
        }
    }

    filterInitiator(event) {
        const table = $('.data-table-wrapper').find('table').DataTable();
        table.columns(1).search( event.target.value ).draw();
    }

    filterAction(event) {
        const table = $('.data-table-wrapper').find('table').DataTable();
        table.columns(3).search( event.target.value ).draw();
    }

    filterInfo(event) {
        const table = $('.data-table-wrapper').find('table').DataTable();
        table.columns(4).search( event.target.value ).draw();
    }

    filterEntity(event) {
        const table = $('.data-table-wrapper').find('table').DataTable();
        table.columns(0).search( event.target.value ).draw();
    }

    renderTable() {
        const columns = [
            {
                title: 'Entity',
                width: 200,
                data: 'entity'
            },
            {
                title: 'Initiator',
                width: 200,
                data: 'initiator'
            },
            {
                title: 'Date',
                width: 200,
                data: 'date'
            },
            {
                title: 'Action',
                width: 200,
                data: 'action'
            },
            {
                title: 'Info',
                width: 200,
                data: 'info'
            }
        ];

        const dateString = (ut) => {
            return Moment.unix(ut/1000).format("DD/MM/YYYY");
        };

        let orderedByDate = this.props.logs.sort((a, b) => b.date - a.date);

        const table = $(this.refs.main).DataTable({
            dom: '<"data-table-wrapper"t>',
            data: orderedByDate,
            columns,
            ordering: false,
            paging: false,
            destroy: true,
            columnDefs: [
                {
                    "targets": 3,
                    render: function(data, type, full, meta) {
                        if (type === 'display' && data === 'ADD') {
                            let rowIndex = meta.row+1;
                            $('#logtable tbody tr:nth-child('+rowIndex+')').addClass('lightGreen');
                            return data;
                        }
                        if (type === 'display' && data === 'DELETE'){
                            let rowIndex = meta.row+1;
                            $('#logtable tbody tr:nth-child('+rowIndex+')').addClass('lightRed');
                            return data;
                        }
                        if (type === 'display' && data === 'UPDATE'){
                            let rowIndex = meta.row+1;
                            $('#logtable tbody tr:nth-child('+rowIndex+')').addClass('lightBlue');
                            return data;
                        }
                        return data;
                    }
                },
                {
                    "targets": 2,
                    render: function(data, type, full, meta) {
                        return dateString(data);
                    }
                }
            ]
        });
        return table;
    }

    handleChange(value, formattedValue) {
        this.setState({
            value: value,
            formattedValue: formattedValue
        });
    }

    componentDidUpdate(){
        let hiddenInputElement = document.getElementById("example-datepicker");
        console.log(hiddenInputElement.value);
        console.log(hiddenInputElement.getAttribute('data-formattedvalue'));
    }

    render() {

        {this.renderTable()}

        return (
            <div>
                <div className="form-group ">
                        <div className="row">
                            <div className="col-xs-4">
                                <label>Date:</label>
                                <DatePicker className="form-control" id="example-datepicker" value={null} onChange={this.filterDate} />
                                <label>Info:</label>
                                <input type="text" className="form-control"
                                       onChange={this.filterInfo}
                                       ref={(input) => { this.searchInput = input; }}
                                       placeholder="Enter info"/>
                            </div>

                            <div className="col-xs-4">
                                <label>Action:</label>
                                <select className="form-control" onChange={this.filterAction}>
                                    <option></option>
                                    <option>ADD</option>
                                    <option>DELETE</option>
                                    <option>UPDATE</option>
                                </select>
                                <div className="row">
                                    <div className="col-xs-6">
                                        <label>Initiator:</label>
                                        <input type="text" className="form-control"
                                               onChange={this.filterInitiator}
                                               ref={(input) => { this.searchInput = input; }}
                                               placeholder="Enter login"/>
                                    </div>
                                    <div className="col-xs-6">
                                        <label>Entity:</label>
                                        <input type="text" className="form-control"
                                               onChange={this.filterEntity}
                                               ref={(input) => { this.searchInput = input; }}
                                               placeholder="Enter entity"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
                <hr/>
                <table id="logtable" className="table table-bordered" style={{"width":"100%"}} ref="main" />
            </div>
        );
    }
}

const mapStateToProps = (state, original) => {
    return Object.assign({}, original, {
        logs: state.logs
    });
};

LogTable.PropTypes = {
    logs: React.PropTypes.array.isRequired
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateLogsList: () => {
            dispatch(fetchLogs());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogTable);