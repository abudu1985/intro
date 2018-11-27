import React from 'react';
import { connect } from 'react-redux';
import Moment from "moment";
import LogTable from "../../../components/LogTable";


class AdminsLog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const dateString = (ut) => {
            return Moment.unix(ut/1000).format("ll");
        };

        const isDeletedAdmin = (data) => {
            if (data) { return true; }
            return false
        };
        return (
            <div>
                <LogTable />
            </div>
        )
    }
}

const mapStateToProps = (state, original) => {
    return Object.assign({}, original, {
        admins: state.admins,
    });
};

export default connect(mapStateToProps)(AdminsLog);
